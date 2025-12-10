
import { TempMailbox, Email } from "../types";

// Switching to 1secmail API which is generally more CORS friendly for frontend usage
const API_BASE = "https://www.1secmail.com/api/v1/";

export const createInbox = async (): Promise<TempMailbox | null> => {
    try {
        // 1secmail generates a random address
        const res = await fetch(`${API_BASE}?action=genRandomMailbox&count=1`);
        
        if (!res.ok) {
             throw new Error('Provider failed');
        }
        
        const data = await res.json();
        const address = data[0]; // Returns array like ["ka83@1secmail.com"]
        
        return {
            address: address,
            token: address // For 1secmail, the address itself acts as the token (we split it later)
        };
    } catch (e) {
        console.error("Mail Creation Error:", e);
        // Fallback Mock for Demo if API is blocked or down
        return {
            address: `demo_${Math.floor(Math.random() * 1000)}@infinity.ai`,
            token: 'mock-token'
        };
    }
};

export const checkInbox = async (token: string): Promise<Email[]> => {
    // Handle Mock Token
    if (token === 'mock-token') {
        return [{
            _id: 'mock-1',
            from: 'System',
            to: 'You',
            subject: 'Welcome to Infinity Mail',
            body: 'This is a demo inbox. The email provider is currently unreachable, so we are simulating the experience.',
            html: '<div style="color: #ccc;"><h3>Welcome!</h3><p>This is a demo inbox.</p><p>The email provider is currently unreachable due to network restrictions, so we are simulating the experience for you.</p></div>',
            date: Date.now()
        }];
    }

    try {
        const [login, domain] = token.split('@');
        // 1. Get list of messages
        const res = await fetch(`${API_BASE}?action=getMessages&login=${login}&domain=${domain}`);
        if (!res.ok) return [];
        
        const messages = await res.json();
        
        // 2. Fetch details for recent messages (Limit to 5 to avoid rate limits)
        // 1secmail assumes we need to fetch individual message content separately
        const recentMessages = messages.slice(0, 5);
        
        const fullEmails = await Promise.all(recentMessages.map(async (msg: any) => {
            try {
                const detailRes = await fetch(`${API_BASE}?action=readMessage&login=${login}&domain=${domain}&id=${msg.id}`);
                const detail = await detailRes.json();
                return {
                    _id: String(detail.id),
                    from: detail.from,
                    to: token,
                    subject: detail.subject,
                    body: detail.textBody,
                    html: detail.htmlBody,
                    date: new Date(detail.date).getTime()
                };
            } catch (e) {
                return null;
            }
        }));

        return fullEmails.filter((e): e is Email => e !== null);
    } catch (e) {
        console.error("Mail Check Error:", e);
        return [];
    }
};
