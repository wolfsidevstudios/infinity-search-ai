
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { token, repoName, fileName, content, description } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing GitHub token" }), { status: 401 });
    }

    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Infinity-Search-Agent'
    };

    // 1. Get User Info (to know the owner)
    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) return new Response(JSON.stringify({ error: "Failed to fetch user" }), { status: userRes.status });
    const user = await userRes.json();
    const owner = user.login;

    // 2. Check if Repo exists, create if not
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
    
    if (repoRes.status === 404) {
        // Create Repo
        repoRes = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: repoName,
                description: description || 'Created by Infinity AI Code Pilot',
                private: false, // Default to public for demo, could be a toggle
                auto_init: true
            })
        });
        
        if (!repoRes.ok) {
            const err = await repoRes.json();
            return new Response(JSON.stringify({ error: "Failed to create repo", details: err }), { status: repoRes.status });
        }
        // Wait a brief moment for init
        await new Promise(r => setTimeout(r, 1000));
    }

    // 3. Get file SHA if it exists (to update)
    let sha = undefined;
    const fileCheckRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${fileName}`, { headers });
    if (fileCheckRes.ok) {
        const fileData = await fileCheckRes.json();
        sha = fileData.sha;
    }

    // 4. Create/Update File
    // Content must be base64 encoded
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${fileName}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            message: `feat: update ${fileName} via Infinity Pilot`,
            content: encodedContent,
            sha: sha
        })
    });

    if (!putRes.ok) {
        const err = await putRes.json();
        return new Response(JSON.stringify({ error: "Failed to push file", details: err }), { status: putRes.status });
    }

    const result = await putRes.json();

    return new Response(JSON.stringify({ success: true, url: result.content.html_url }), { 
        headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("GitHub Sync Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
