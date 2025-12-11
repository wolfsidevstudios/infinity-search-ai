
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { pat, modelId, modelVersionId, payload } = await request.json();

    if (!pat || !modelId || !payload) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const versionPath = modelVersionId ? `/versions/${modelVersionId}` : '';
    const clarifaiUrl = `https://api.clarifai.com/v2/models/${modelId}${versionPath}/outputs`;

    const response = await fetch(clarifaiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + pat,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Clarifai Proxy Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Proxy Error" }), { status: 500 });
  }
}
