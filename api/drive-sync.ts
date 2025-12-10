
export const config = {
  runtime: 'edge',
};

const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { history, token } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 });
    }

    const fileName = 'infinity_search_history.json';
    const fileContent = JSON.stringify(history, null, 2);
    const fileType = 'application/json';

    // 1. Search for existing file
    const searchRes = await fetch(`${GOOGLE_DRIVE_API_URL}?q=name='${fileName}' and trashed=false&fields=files(id)`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!searchRes.ok) {
        if (searchRes.status === 401) {
            return new Response(JSON.stringify({ success: false, message: "Token expired" }), { status: 401 });
        }
        return new Response(JSON.stringify({ success: false, message: "Drive search failed" }), { status: searchRes.status });
    }

    const searchData = await searchRes.json();
    const existingFileId = searchData.files?.[0]?.id;

    // 2. Prepare Multipart Body
    const metadata = {
        name: fileName,
        mimeType: fileType,
        description: 'Search History backup from Infinity Search AI'
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const multipartBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${fileType}\r\n\r\n` +
        fileContent +
        closeDelim;

    // 3. Update or Create
    let finalRes;
    if (existingFileId) {
        finalRes = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}/${existingFileId}?uploadType=multipart`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartBody
        });
    } else {
        finalRes = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=multipart`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartBody
        });
    }

    if (!finalRes.ok) {
         if (finalRes.status === 401) {
             return new Response(JSON.stringify({ success: false, message: "Token expired" }), { status: 401 });
         }
         return new Response(JSON.stringify({ success: false, message: "Upload failed" }), { status: finalRes.status });
    }

    return new Response(JSON.stringify({ success: true }), { 
        headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Drive Sync Edge Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
