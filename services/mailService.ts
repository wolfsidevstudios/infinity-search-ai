
import { TempMailbox, Email } from "../types";

const API_BASE = "https://api.tempmail.lol/v2";

export const createInbox = async (): Promise<TempMailbox | null> => {
    try {
        const res = await fetch(`${API_BASE}/inbox/create`, {
            method: 'POST'
        });
        
        if (!res.ok) return null;
        
        const data = await res.json();
        return {
            address: data.address,
            token: data.token
        };
    } catch (e) {
        console.error("Mail Creation Error:", e);
        return null;
    }
};

export const checkInbox = async (token: string): Promise<Email[]> => {
    try {
        const res = await fetch(`${API_BASE}/inbox?token=${token}`);
        if (!res.ok) return [];
        
        const data = await res.json();
        return data.emails || [];
    } catch (e) {
        console.error("Mail Check Error:", e);
        return [];
    }
};
