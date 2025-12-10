
export const config = {
  runtime: 'edge',
};

const POLAR_API_BASE = 'https://api.polar.sh/v1';
const POLAR_SANDBOX_API_BASE = 'https://sandbox-api.polar.sh/v1';

export default async function handler(request: Request) {
  try {
    const { token, isSandbox = true } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), { status: 400 });
    }

    const baseUrl = isSandbox ? POLAR_SANDBOX_API_BASE : POLAR_API_BASE;

    // 1. Fetch products
    const productsRes = await fetch(`${baseUrl}/products?is_recurring=true`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!productsRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: productsRes.status });
    }

    const productsData = await productsRes.json();
    const firstProduct = productsData.items?.[0];

    if (!firstProduct || !firstProduct.prices || firstProduct.prices.length === 0) {
      return new Response(JSON.stringify({ error: "No products found" }), { status: 404 });
    }

    const priceId = firstProduct.prices[0].id;

    // 2. Create Checkout Session
    const origin = new URL(request.url).origin; // Get current origin dynamically
    const successUrl = `${origin}/success?provider=polar&success=true`;

    const checkoutRes = await fetch(`${baseUrl}/checkouts/custom/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_price_id: priceId,
        success_url: successUrl,
      })
    });

    if (!checkoutRes.ok) {
        return new Response(JSON.stringify({ error: "Failed to create checkout" }), { status: checkoutRes.status });
    }

    const checkoutData = await checkoutRes.json();
    
    return new Response(JSON.stringify({ url: checkoutData.url }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
