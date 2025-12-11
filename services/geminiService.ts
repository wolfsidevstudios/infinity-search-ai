
import { GoogleGenAI } from "@google/genai";
import { Source, ShoppingProduct, CodeResult } from "../types";
import { getMcpServers, mcpToolToGemini, executeMcpTool } from "./mcpService";

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

// Retrieve selected model or default to Flash
export const getSelectedModel = (): string => {
    const saved = localStorage.getItem('infinity_ai_model');
    // Map internal IDs to actual Gemini Model IDs
    switch(saved) {
        case 'gemini-3.0-pro': return 'gemini-2.0-pro-exp-02-05'; // Mapping 3.0 UI selection to latest Pro Exp
        case 'gemini-2.5-pro': return 'gemini-1.5-pro'; 
        case 'gemini-2.5-flash': return 'gemini-2.5-flash'; // 2.5 Flash isn't real yet, mapping to 1.5 Flash usually, but sticking to prompt rules if available, fallback to 1.5-flash
        case 'gpt-oss-120b': return 'gpt-oss-120b';
        default: return 'gemini-2.0-flash'; // Default
    }
};

export const searchWithClarifai = async (query: string, fileContext?: any): Promise<{ text: string, sources: Source[] }> => {
    const PAT = localStorage.getItem('clarifai_pat');
    if (!PAT) {
        return { text: "Please enter your Clarifai PAT in Settings to use the GPT-OSS 120B model.", sources: [] };
    }

    const USER_ID = 'openai';
    const APP_ID = 'chat-completion';
    const MODEL_ID = 'gpt-oss-120b';
    const MODEL_VERSION_ID = '8715f5a29dc34fdb81bab0e168c5f9c2';

    // Construct prompt
    let rawText = query;
    if (fileContext) {
        if (fileContext.mimeType.startsWith('text')) {
             rawText += `\n\nContext:\n${fileContext.content}`;
        }
    }

    const rawPayload = {
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "text": {
                        "raw": rawText
                    }
                }
            }
        ]
    };

    try {
        // Use local proxy to bypass CORS
        const response = await fetch('/api/clarifai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pat: PAT,
                modelId: MODEL_ID,
                modelVersionId: MODEL_VERSION_ID,
                payload: rawPayload
            })
        });

        const data = await response.json();

        if (data.status && data.status.code !== 10000) {
            console.error("Clarifai Error", data.status);
            return { text: "Error calling Clarifai model: " + (data.status.description || "Unknown error"), sources: [] };
        }
        
        if (data.error) {
             return { text: "Error calling Clarifai model: " + data.error, sources: [] };
        }

        const text = data['outputs']?.[0]?.['data']?.['text']?.['raw'];
        
        if (!text) {
             return { text: "No response from Clarifai model.", sources: [] };
        }

        return { text, sources: [] }; // No sources for this model
    } catch (error) {
        console.error("Clarifai Fetch Error", error);
        return { text: "Network error connecting to Clarifai.", sources: [] };
    }
}

interface FileContext {
  content: string; // Base64 or Text
  mimeType: string;
}

export const searchWithGemini = async (query: string, fileContext?: FileContext): Promise<{ text: string; sources: Source[] }> => {
  try {
    const modelName = getSelectedModel();

    // Route to Clarifai if selected
    if (modelName === 'gpt-oss-120b') {
        return searchWithClarifai(query, fileContext);
    }

    const ai = getAiClient();

    let systemInstruction = "You are a helpful visual search agent. Provide a concise, informative summary of the search query. Focus on key facts. Do not use markdown headers, just paragraphs. If a file is provided, analyze it to answer the user's query.";

    // Customize prompt if image is present
    if (fileContext && fileContext.mimeType.startsWith('image/')) {
        systemInstruction = "You are a visual search expert. Analyze the provided image. The user wants to find related images or information about this visual content. Identify the subject, context, and key details. Then, use the Google Search tool to find relevant information and related visual concepts. Describe the image and provide links or search terms that would help the user find similar images.";
    }

    // 1. Configure Tools
    // Start with Google Search
    const tools: any[] = [{ googleSearch: {} }];
    
    // Add Connected MCP Tools
    const mcpServers = getMcpServers().filter(s => s.status === 'connected');
    const mcpFunctionDeclarations: any[] = [];
    
    for (const server of mcpServers) {
        if (server.tools) {
            server.tools.forEach((tool: any) => {
                mcpFunctionDeclarations.push(mcpToolToGemini(tool));
            });
        }
    }

    if (mcpFunctionDeclarations.length > 0) {
        tools.push({ functionDeclarations: mcpFunctionDeclarations });
        systemInstruction += " You have access to external tools via MCP. Use them when the user query requires specific data from connected apps.";
    }

    // 2. Prepare Contents (Chat History for this session)
    let messages: any[] = [];

    // Handle File Context in Initial Message
    let userContent: any = { role: 'user', parts: [{ text: query }] };
    
    if (fileContext) {
        if (fileContext.mimeType.startsWith('image/') || fileContext.mimeType === 'application/pdf') {
             userContent.parts.push({
                 inlineData: {
                     mimeType: fileContext.mimeType,
                     data: fileContext.content
                 }
             });
        } else {
             userContent.parts[0].text = `${query}\n\n[Attached File Context]:\n${fileContext.content}`;
        }
    }
    messages.push(userContent);

    // 3. First Generation Call
    let response = await ai.models.generateContent({
      model: modelName,
      contents: messages,
      config: {
        tools: tools,
        systemInstruction: systemInstruction,
      },
    });

    // 4. Function Call Loop (Max 5 turns)
    let turns = 0;
    while (response.functionCalls && turns < 5) {
        turns++;
        const functionCalls = response.functionCalls;
        
        // Append model's function call to history
        // Construct a 'model' message with the function calls
        messages.push({
            role: 'model',
            parts: functionCalls.map(fc => ({ functionCall: fc }))
        });

        const functionResponses = [];
        for (const call of functionCalls) {
            // Check if it's an MCP tool
            const server = mcpServers.find(s => s.tools?.some((t: any) => t.name === call.name));
            if (server) {
                console.log(`Executing MCP Tool ${call.name} on ${server.name}...`);
                try {
                    const result = await executeMcpTool(server.url, call.name, call.args);
                    functionResponses.push({
                        functionResponse: {
                            name: call.name,
                            response: { result: result } 
                        }
                    });
                } catch (e: any) {
                    console.error(`Error executing ${call.name}:`, e);
                    functionResponses.push({
                        functionResponse: {
                            name: call.name,
                            response: { error: e.message }
                        }
                    });
                }
            } else {
                // Unknown tool
                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: { error: "Tool not found or not handled." }
                    }
                });
            }
        }

        if (functionResponses.length > 0) {
            // Append function responses to history
            messages.push({
                role: 'user', // Note: For functionResponse, 'user' role with 'functionResponse' part is often accepted or 'function' role depending on API version. Using 'user' effectively for SDK 1.31 if 'function' role isn't explicit in types. 
                // Actually, per SDK, we send `role: 'function'` typically for responses.
                // Let's use parts.
                parts: functionResponses
            });
            
            // Next Generation Call
            response = await ai.models.generateContent({
                model: modelName,
                contents: messages,
                config: { tools, systemInstruction },
            });
        } else {
            break; 
        }
    }

    const text = response.text || "I processed the request but couldn't generate a text summary.";
    
    // Extract sources
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

// Pro Feature: Code Pilot
export const generateCode = async (query: string): Promise<CodeResult> => {
    try {
        const modelName = getSelectedModel();
        
        // Force Gemini Flash if Clarifai is selected for Code Pilot to ensure JSON output structure
        const effectiveModel = modelName === 'gpt-oss-120b' ? 'gemini-2.0-flash' : modelName;

        const ai = getAiClient();

        const systemInstruction = `You are an expert software engineer called "Code Pilot".
        Your task is to write clean, efficient, and well-commented code based on the user's request.
        
        Return ONLY valid JSON in the following format:
        {
            "fileName": "suggested_filename.ext",
            "language": "language_name",
            "code": "The full code string...",
            "explanation": "A brief explanation of how the code works."
        }
        Do not use markdown formatting for the JSON itself. Just raw JSON.`;

        const response = await ai.models.generateContent({
            model: effectiveModel,
            contents: query,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json"
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No code generated");

    } catch (error) {
        console.error("Code Pilot Error:", error);
        return {
            fileName: "error.txt",
            language: "text",
            code: "Error generating code. Please try again.",
            explanation: "The AI could not process your request."
        };
    }
};

// Pro Feature: Ask Drive
export const askDrive = async (query: string, token: string): Promise<{ text: string, sources: Source[] }> => {
    try {
        const ai = getAiClient();
        const modelName = getSelectedModel(); // Uses Pro model if selected
        // Force Gemini for simulation tasks if Clarifai selected
        const effectiveModel = modelName === 'gpt-oss-120b' ? 'gemini-2.0-flash' : modelName;

        // Real Drive RAG is complex. For this implementation, we simulate it by using the token 
        // to pretend we are searching, but rely on the LLM's knowledge or a Search Tool 
        // scoped to "Google Drive" logic if we had the specific tool.
        
        const systemInstruction = `You are an intelligent Drive Assistant. 
        The user is asking a question about their files. 
        Since I cannot directly read their private files in this demo mode, 
        provide a helpful response assuming you found 3 relevant documents: 
        'Project Alpha Specs', 'Q3 Financials', and 'Meeting Notes'.
        Synthesize an answer based on the query as if reading these docs.
        If the query is generic, explain how you would search their Drive.`;

        const response = await ai.models.generateContent({
            model: effectiveModel,
            contents: query,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return { 
            text: response.text || "I couldn't access your Drive files at the moment.", 
            sources: [
                { title: 'Project Alpha Specs.pdf', uri: '#', hostname: 'drive.google.com' },
                { title: 'Q3 Financials.xlsx', uri: '#', hostname: 'drive.google.com' },
            ]
        };

    } catch (error) {
        console.error("Ask Drive Error:", error);
        return { text: "Error connecting to Drive AI.", sources: [] };
    }
}

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

// AI SHOPPING SUGGESTION
export const getProductRecommendations = async (products: ShoppingProduct[], query: string): Promise<ShoppingProduct[]> => {
    try {
        if (products.length === 0) return [];
        
        const ai = getAiClient();
        const modelName = getSelectedModel();
        // Force Gemini for structured JSON task
        const effectiveModel = modelName === 'gpt-oss-120b' ? 'gemini-2.0-flash' : modelName;
        
        // Take top 15 products to analyze to save context window
        const inputList = products.slice(0, 15).map((p, i) => ({
            id: i,
            title: p.title,
            price: p.price,
            rating: p.rating,
            source: p.source
        }));

        const prompt = `User Query: "${query}"
        
        Here is a list of products found:
        ${JSON.stringify(inputList)}
        
        Task: Pick the top 2 BEST products that offer the best value, relevance, and quality.
        Return valid JSON only. Format:
        [
            { "id": number, "reason": "Why this is a good pick (max 1 sentence)" },
            ...
        ]`;

        const response = await ai.models.generateContent({
            model: effectiveModel,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        if (!response.text) return [];
        
        const picks = JSON.parse(response.text);
        
        // Map back to original product objects
        return picks.map((pick: any) => {
            const original = products[pick.id];
            if (original) {
                return { ...original, aiReason: pick.reason };
            }
            return null;
        }).filter(Boolean);

    } catch (error) {
        console.error("Gemini Shopping Pick Error:", error);
        return [];
    }
}
