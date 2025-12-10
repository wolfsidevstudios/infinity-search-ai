
import { HistoryItem } from "../types";

export const syncHistoryToDrive = async (history: HistoryItem[], token: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch('/api/drive-sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ history, token })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { success: false, message: data.message || "Sync failed" };
        }

        return { success: true };
    } catch (error) {
        console.error("Google Drive Sync Service Error:", error);
        return { success: false, message: "Network error" };
    }
};
