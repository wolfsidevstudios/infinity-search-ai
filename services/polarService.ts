
// Service to handle Polar.sh integrations

const POLAR_API_BASE = 'https://api.polar.sh/v1';
const POLAR_SANDBOX_API_BASE = 'https://sandbox-api.polar.sh/v1';

export const createCheckoutSession = async (accessToken: string, isSandbox: boolean = true): Promise<string | null> => {
    // 1. Try Edge Function First
    try {
        const edgeRes = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: accessToken, isSandbox })
        });

        if (edgeRes.ok) {
            const data = await edgeRes.json();
            if (data.url) return data.url;
        }
    } catch (e) {
        // Fallback silently if /api/checkout doesn't exist (e.g. running in client-only mode)
        console.log("Edge function unreachable, falling back to client-side logic.");
    }

    // 2. Client-Side Fallback (Demo Mode)
    try {
        const baseUrl = isSandbox ? POLAR_SANDBOX_API_BASE : POLAR_API_BASE;
        
        // Fetch products to find a price ID
        const productsRes = await fetch(`${baseUrl}/products?is_recurring=true`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!productsRes.ok) {
            console.error("Polar Products Fetch Error", productsRes.statusText);
            return null;
        }

        const productsData = await productsRes.json();
        const firstProduct = productsData.items?.[0];
        
        if (!firstProduct || !firstProduct.prices || firstProduct.prices.length === 0) {
            console.warn("No products found for this Polar token.");
            return null;
        }

        const priceId = firstProduct.prices[0].id;

        // Create Checkout Session
        const checkoutRes = await fetch(`${baseUrl}/checkouts/custom/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_price_id: priceId,
                success_url: window.location.origin + '/?success=true', // Redirect to root with param
                customer_email: undefined 
            })
        });

        if (!checkoutRes.ok) {
             console.error("Polar Checkout Creation Error", checkoutRes.statusText);
             return null;
        }

        const checkoutData = await checkoutRes.json();
        return checkoutData.url;

    } catch (error) {
        console.error("Polar Service Error:", error);
        return null;
    }
};
