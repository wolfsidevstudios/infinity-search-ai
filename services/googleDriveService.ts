
import { HistoryItem } from "../types";

const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

export const syncHistoryToDrive = async (history: HistoryItem[], token: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const fileName = 'infinity_search_history.json';
        const fileContent = JSON.stringify(history, null, 2);
        const fileType = 'application/json';

        // 1. Search for existing file
        // We use q param to find the specific file by name not in trash
        const searchRes = await fetch(`${GOOGLE_DRIVE_API_URL}?q=name='${fileName}' and trashed=false&fields=files(id)`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!searchRes.ok) {
            if (searchRes.status === 401) return { success: false, message: "Token expired" };
            return { success: false, message: `Search failed: ${searchRes.statusText}` };
        }

        const searchData = await searchRes.json();
        const existingFileId = searchData.files?.[0]?.id;

        // 2. Prepare the Body
        // Google Drive API requires multipart/related for metadata + media uploads.
        // We manually construct this body to ensure correct headers and boundaries.
        
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

        if (existingFileId) {
            // 3. Update existing file
            // For updates, we can just use uploadType=media (PATCH) if we only update content,
            // or multipart if we want to update metadata too. Let's stick to multipart to be safe.
            const updateRes = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}/${existingFileId}?uploadType=multipart`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`
                },
                body: multipartBody
            });

            if (!updateRes.ok) {
                if (updateRes.status === 401) return { success: false, message: "Token expired" };
                return { success: false, message: "Update failed" };
            }

            return { success: true };

        } else {
            // 4. Create new file
            const createRes = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=multipart`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`
                },
                body: multipartBody
            });

            if (!createRes.ok) {
                 if (createRes.status === 401) return { success: false, message: "Token expired" };
                 return { success: false, message: "Creation failed" };
            }
            
            return { success: true };
        }
    } catch (error) {
        console.error("Google Drive Sync Error:", error);
        return { success: false, message: "Network error" };
    }
};
