import { GoogleGenAI } from "@google/genai";
import { Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchWithGemini = async (query: string): Promise<{ text: string; sources: Source[] }> => {
  try {
    const modelName = "gemini-2.5-flash";

    const systemInstruction = "You are a helpful visual search agent. Provide a concise, informative summary of the search query. Focus on key facts. Do not use markdown headers, just paragraphs.";

    // Configure tools
    const tools = [{ googleSearch: {} }];

    const response = await ai.models.generateContent({
      model: modelName,
      contents: query,
      config: {
        tools: tools,
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text || "I couldn't find information on that topic.";
    
    // Extract sources from grounding metadata
    const candidates = response.candidates;
    const sources: Source[] = [];
    
    if (candidates && candidates.length > 0) {
      const groundingMetadata = candidates[0].groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            try {
                const url = new URL(chunk.web.uri);
                sources.push({
                  title: chunk.web.title || chunk.web.uri,
                  uri: chunk.web.uri,
                  hostname: url.hostname
                });
            } catch (e) {
                sources.push({
                    title: chunk.web.title || "Source",
                    uri: chunk.web.uri,
                    hostname: "Web"
                });
            }
          }
        });
      }
    }

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(v2 => (v2.uri === v.uri)) === i);

    return { text, sources: uniqueSources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { 
        text: "I encountered an issue connecting to the AI service. Please check your connection and try again.", 
        sources: [] 
    };
  }
};

export const summarizeWorldEvents = async (headlines: string[]): Promise<string> => {
    try {
        const prompt = `Here are the top news headlines right now:
        ${headlines.map(h => `- ${h}`).join('\n')}
        
        Write a short, engaging "Global Briefing" paragraph summarizing the key themes or most important events happening in the world right now based on these headlines. Keep it under 80 words.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "Unable to generate global summary.";
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return "Discover the latest stories from around the globe.";
    }
}

export const getMusicInsights = async (track: string, artist: string): Promise<string> => {
    try {
        const prompt = `Write a 2-sentence interesting description or fun fact about the song "${track}" by ${artist}. Keep it engaging and concise for a music player interface.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || `Listen to ${track} by ${artist} on Spotify.`;
    } catch (error) {
        return `Enjoy listening to ${track} by ${artist}.`;
    }
}