
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
}

export const fetchBiblePassage = async (query: string, versionId: string = 'kjv'): Promise<BibleResponse | null> => {
  try {
    // 1. Check if query looks like a reference (e.g., "John 3:16")
    const referenceRegex = /^\d?\s?[a-zA-Z]+\s\d+(:(\d+([-\u2013\u2014]\d+)?)?)?$/;
    let reference = query;

    // 2. If it's a keyword search (e.g., "verses about hope"), use Gemini to get a reference first
    if (!referenceRegex.test(query)) {
        const ai = getAiClient();
        const prompt = `User query: "${query}". 
        Identify the single most relevant Bible chapter or verse reference for this query. 
        Return ONLY the reference string (e.g., "Jeremiah 29:11" or "Psalm 23"). 
        Do not add any other text.`;
        
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        
        const text = result.text?.trim();
        if (text) reference = text;
    }

    // 3. Fetch from API
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=${versionId}`);
    
    if (!response.ok) {
        // Fallback: If exact version fails, try KJV (most supported)
        if (versionId !== 'kjv') {
             return fetchBiblePassage(reference, 'kjv');
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
