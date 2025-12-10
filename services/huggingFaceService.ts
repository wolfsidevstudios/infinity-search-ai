
import { pipeline, env } from '@huggingface/transformers';

// Configure environment to work in browser CDNs
env.allowLocalModels = false;
env.useBrowserCache = true;

let sentimentPipeline: any = null;

export const analyzeSentiment = async (text: string): Promise<{ label: string, score: number } | null> => {
  try {
    // Singleton pattern for the pipeline to avoid reloading
    if (!sentimentPipeline) {
      console.log("Loading Sentiment Model...");
      sentimentPipeline = await pipeline('sentiment-analysis');
    }
    
    // Safety check for empty text
    if (!text || !text.trim()) return null;

    // Truncate text to avoid model token limits (simple truncation for demo)
    const truncatedText = text.slice(0, 500);
    
    const output = await sentimentPipeline(truncatedText);
    
    // Output format is typically: [{'label': 'POSITIVE', 'score': 0.99...}]
    if (output && output.length > 0) {
        return output[0];
    }
    return null;
  } catch (error) {
    console.error("HuggingFace Sentiment Error:", error);
    return null;
  }
};
