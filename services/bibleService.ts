
import { getAiClient } from "./geminiService";

export interface BibleVersion {
  id: string;
  name: string;
  language: 'en' | 'es';
}

export const BIBLE_VERSIONS: BibleVersion[] = [
  // English
  { id: 'kjv', name: 'King James Version (KJV)', language: 'en' },
  { id: 'web', name: 'World English Bible (WEB)', language: 'en' },
  { id: 'asv', name: 'American Standard Version (ASV)', language: 'en' },
  { id: 'bbe', name: 'Bible in Basic English', language: 'en' },
  { id: 'oeb-us', name: 'Open English Bible (US)', language: 'en' },
  { id: 'clementine', name: 'Clementine Latin Vulgate', language: 'en' }, // historical
  { id: 'ylt', name: 'Young\'s Literal Translation', language: 'en' },
  { id: 'darby', name: 'Darby Bible', language: 'en' },
  { id: 'dra', name: 'Douay-Rheims 1899 American Edition', language: 'en' },
  
  // Spanish
  { id: 'rvr', name: 'Reina Valera 1909', language: 'es' }, // Public domain alternative to 1960
  { id: 'sev', name: 'Sagradas Escrituras 1569', language: 'es' },
  { id: 'rv1909', name: 'Reina Valera Antigua', language: 'es' },
];

interface BibleResponse {
  reference: string;
  text: string;
  verses: {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
  translation_id: string;
  translation_name: string;
}

export const fetchBiblePassage = async (query: string, versionId: string = 'kjv', language: 'en' | 'es' = 'en'): Promise<BibleResponse | null> => {
  try {
    // 1. Check if query looks like a specific reference (e.g., "John 3:16" or "Juan 3:16")
    // Simple regex for Number(optional) Name Chapter:Verse
    const referenceRegex = /^\d?\s?[a-zA-Z\u00C0-\u00FF]+\s\d+(:(\d+([-\u2013\u2014]\d+)?)?)?$/;
    let reference = query;

    // 2. If it's a keyword search (e.g., "verses about hope", "versiculos de amor"), use Gemini to get a reference first
    // We also use Gemini to normalize book names from Spanish to English standard if needed by the API,
    // though bible-api.com handles many languages well, standardization helps.
    if (!referenceRegex.test(query) || language === 'es') {
        const ai = getAiClient();
        const prompt = `User query: "${query}". 
        Target Language Context: ${language === 'es' ? 'Spanish' : 'English'}.
        
        Task: Identify the single most relevant Bible chapter or verse reference for this query.
        - If the user asks for a topic (e.g. "love", "paz"), find the best verse.
        - If the user provides a book name in Spanish (e.g. "Salmos"), map it to the standard reference (e.g. "Psalms 23").
        
        Return ONLY the standard reference string (e.g., "Jeremiah 29:11" or "Psalms 23"). 
        Do not add any other text.`;
        
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        
        const text = result.text?.trim();
        if (text) reference = text;
    }

    // 3. Fetch from API
    // Ensure we encode the reference properly
    const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${versionId}`;
    console.log("Fetching Bible API:", url);

    const response = await fetch(url);
    
    if (!response.ok) {
        // Fallback: If exact version fails (some rare versions might have issues), try KJV or RVR based on lang
        if (versionId !== 'kjv' && language === 'en') {
             return fetchBiblePassage(reference, 'kjv', 'en');
        }
        if (versionId !== 'rvr' && language === 'es') {
             return fetchBiblePassage(reference, 'rvr', 'es');
        }
        return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Bible Fetch Error:", error);
    return null;
  }
};
