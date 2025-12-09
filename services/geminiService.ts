import { GoogleGenAI } from "@google/genai";
import { Source } from "../types";

// Helper to get the AI client, prioritizing Local Storage key if set
export const getAiClient = () => {
    const customKey = localStorage.getItem('gemini_api_key');
    
    // Safe check for process.env to avoid "Uncaught ReferenceError: process is not defined" in pure browser envs
    let envKey = undefined;
    try {
        if (typeof process !== 'undefined' && process.env) {
            envKey = process.env.API_KEY;
        }
    } catch (e) {
        // process variable not available
    }

    return new GoogleGenAI({ apiKey: customKey || envKey || '' });
};

interface FileContext {
  content: string; // Base64 or Text
  mimeType: string;
}

export const searchWithGemini = async (query: string, fileContext?: FileContext): Promise<{ text: string; sources: Source[] }> => {
  try {
    const ai = getAiClient();
    const modelName = "gemini-2.5-flash";

    let systemInstruction = "You are a helpful visual search agent. Provide a concise, informative summary of the search query. Focus on key facts. Do not use markdown headers, just paragraphs. If a file is provided, analyze it to answer the user's query.";

    // Customize prompt if image is present
    if (fileContext && fileContext.mimeType.startsWith('image/')) {
        systemInstruction = "You are a visual search expert. Analyze the provided image. The user wants to find related images or information about this visual content. Identify the subject, context, and key details. Then, use the Google Search tool to find relevant information and related visual concepts. Describe the image and provide links or search terms that would help the user find similar images.";
    }

    // Configure tools
    const tools = [{ googleSearch: {} }];

    let contents: any = query;

    // Handle File Context
    if (fileContext) {
        if (fileContext.mimeType.startsWith('image/') || fileContext.mimeType === 'application/pdf') {
             // Use inlineData for images and PDFs
             contents = {
                 role: 'user',
                 parts: [
                     { text: query },
                     {
                         inlineData: {
                             mimeType: fileContext.mimeType,
                             data: fileContext.content
                         }
                     }
                 ]
             };
        } else {
             // For text files, append content to prompt
             contents = `${query}\n\n[Attached File Context]:\n${fileContext.content}`;
        }
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
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
        text: "I encountered an issue connecting to the AI service. Please check your connection or your custom API Key in settings.", 
        sources: [] 
    };
  }
};

export const summarizeWorldEvents = async (headlines: string[]): Promise<string> => {
    try {
        const ai = getAiClient();
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
        const ai = getAiClient();
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

export const getBibleInsight = async (reference: string, passageText: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `You are a theology assistant. Analyze this Bible passage (${reference}): "${passageText}".
        
        Provide a brief, insightful 3-4 sentence commentary. Include:
        1. Historical context or author's intent.
        2. A key theological takeaway or practical application for today.
        
        Keep the tone reverent, intelligent, and accessible. Do not use markdown.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "Reflect on these words and their meaning in your life.";
    } catch (error) {
        return "Unable to generate AI insight at this time.";
    }
}

// AGENT VISION API
export const getAgentVisioPlan = async (query: string, screenshotBase64: string, history: any[]): Promise<any> => {
    try {
        const ai = getAiClient();
        const systemInstruction = `You are an autonomous GUI agent. You have eyes.
        Analyze the provided screenshot of the browser window.
        Your goal is to complete the user's request by interacting with the UI.
        
        Return ONLY valid JSON. No markdown.
        Format:
        {
            "thought": "I see a 'Create Link' button in the top right. I should click it.",
            "done": boolean, // true if task is complete
            "action": {
                "type": "CLICK" | "TYPE" | "NAVIGATE" | "RESPOND" | "WAIT",
                "x": number (0-100), // percent coordinates
                "y": number (0-100), // percent coordinates
                "text": "string to type or respond",
                "payload": "url for navigate"
            }
        }`;

        const contents = [
            {
                role: 'user',
                parts: [
                    { text: `User Goal: ${query}. History of actions: ${JSON.stringify(history)}. What is the NEXT SINGLE STEP?` },
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: screenshotBase64
                        }
                    }
                ]
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json"
            }
        });

        const text = response.text || '{}';
        return JSON.parse(text);

    } catch (error) {
        console.error("Agent Vision Error:", error);
        return { thought: "Error processing vision.", done: true, action: { type: "RESPOND", text: "I had trouble seeing the screen." } };
    }
};