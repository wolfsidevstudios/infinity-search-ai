
// Service to handle Polar.sh integrations

const POLAR_API_BASE = 'https://api.polar.sh/v1';
const POLAR_SANDBOX_API_BASE = 'https://sandbox-api.polar.sh/v1';

export const createCheckoutSession = async (accessToken: string, isSandbox: boolean = true): Promise<string | null> => {
    try {
        const baseUrl = isSandbox ? POLAR_SANDBOX_API_BASE : POLAR_API_BASE;
        
        // 1. First, fetch products to find a suitable price ID to checkout
        // In a real app, you might have a specific price ID hardcoded, but if using a generic token,
        // we'll try to find the first available subscription product.
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

        // 2. Create Checkout Session
        const checkoutRes = await fetch(`${baseUrl}/checkouts/custom/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_price_id: priceId,
                success_url: window.location.origin + '/success?provider=polar',
                customer_email: undefined // Optional: Pre-fill if we have user email
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
