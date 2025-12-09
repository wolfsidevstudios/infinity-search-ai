
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
  isAiGenerated?: boolean;
}

export const fetchBiblePassage = async (query: string, versionId: string = 'kjv', language: 'en' | 'es' = 'en'): Promise<BibleResponse | null> => {
  try {
    const ai = getAiClient();
    
    // 1. Identify intent with AI
    const referenceRegex = /^\d?\s?[a-zA-Z\u00C0-\u00FF]+\s\d+(:(\d+([-\u2013\u2014]\d+)?)?)?$/;
    let reference = query;
    let isTopical = !referenceRegex.test(query);

    if (isTopical || language === 'es') {
        const prompt = `User query: "${query}". 
        Target Language Context: ${language === 'es' ? 'Spanish' : 'English'}.
        
        Task: Identify the single most relevant Bible chapter or verse reference for this query.
        - If the user asks for a topic (e.g. "love", "paz"), find the BEST possible verse that captures the essence.
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

    // 2. Try Fetching from API
    const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${versionId}`;
    const response = await fetch(url);
    
    if (response.ok) {
        const data = await response.json();
        return data;
    }

    // 3. AI Fallback (If API fails or translation unavailable)
    // This makes the search truly "AI Powered" by ensuring a result even for complex or obscure requests
    console.log("Bible API failed, falling back to AI generation...");
    
    const fallbackPrompt = `Provide the full text for the Bible passage: "${reference}" (or the verse best matching "${query}").
    Translation Style: ${versionId === 'kjv' ? 'King James (Old English)' : 'Modern English'}.
    Language: ${language === 'es' ? 'Spanish' : 'English'}.
    
    Return the response as JSON matching this structure:
    {
      "reference": "Book Chapter:Verse",
      "text": "Full text of the passage...",
      "translation_name": "AI Generated Translation",
      "verses": [
         { "book_name": "Book", "chapter": 1, "verse": 1, "text": "Verse text..." }
      ]
    }`;

    const fallbackResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fallbackPrompt,
        config: { responseMimeType: "application/json" }
    });

    if (fallbackResult.text) {
        const data = JSON.parse(fallbackResult.text);
        return {
            ...data,
            translation_id: 'ai-gen',
            isAiGenerated: true
        };
    }

    return null;

  } catch (error) {
    console.error("Bible Fetch Error:", error);
    return null;
  }
};
