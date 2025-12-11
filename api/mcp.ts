
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { serverUrl, payload } = await request.json();
    
    if (!serverUrl || !payload) {
        return new Response(JSON.stringify({ error: 'Missing serverUrl or payload' }), { status: 400 });
    }

    // Forward JSON-RPC request to the MCP server
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text();
        return new Response(JSON.stringify({ error: `MCP Server Error: ${response.status} ${response.statusText}`, details: text }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e: any) {
    console.error("MCP Proxy Error:", e);
    return new Response(JSON.stringify({ error: e.message || 'Internal Proxy Error' }), { status: 500 });
  }
}
