
import { HistoryItem } from "../types";

const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

export const syncHistoryToDrive = async (history: HistoryItem[], token: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const fileName = 'infinity_search_history.json';
        const fileContent = JSON.stringify(history, null, 2);
        const fileType = 'application/json';

        // 1. Search for existing file
        const searchRes = await fetch(`${GOOGLE_DRIVE_API_URL}?q=name='${fileName}' and trashed=false&fields=files(id)`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!searchRes.ok) {
            if (searchRes.status === 401) return { success: false, message: "Token expired" };
            return { success: false, message: "Search failed" };
        }

        const searchData = await searchRes.json();
        const existingFileId = searchData.files?.[0]?.id;

        const blob = new Blob([fileContent], { type: fileType });

        if (existingFileId) {
            // 2. Update existing file
            const updateRes = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}/${existingFileId}?uploadType=media`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': fileType
                },
                body: blob
            });
            return { success: updateRes.ok };
        } else {
            // 3. Create new file
            const metadata = {
                name: fileName,
                mimeType: fileType,
                description: 'Search History backup from Infinity Search AI'
            };

            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', blob);

            const createRes = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=multipart`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            return { success: createRes.ok };
        }
    } catch (error) {
        console.error("Google Drive Sync Error:", error);
        return { success: false, message: "Network error" };
    }
};
