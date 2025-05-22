
// Utility functions for Gemini AI API via Supabase Edge Function
import { supabase } from "@/integrations/supabase/client";

// Types for AI requests
interface AIRequest {
  prompt: string;
  requestType: string;
  noteContent: string;
}

interface AIResponse {
  result?: string;
  error?: string;
}

// Main function to call Gemini AI via Supabase Edge Function
export async function callGeminiAI(prompt: string, noteContent: string, requestType: string): Promise<string> {
  try {
    // Prepare request payload
    const requestBody: AIRequest = {
      prompt,
      requestType,
      noteContent
    };

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: JSON.stringify(requestBody),
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    const response = data as AIResponse;
    
    if (response.error) {
      throw new Error(`AI processing error: ${response.error}`);
    }
    
    if (!response.result) {
      throw new Error('No valid response received');
    }
    
    return response.result;
  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    throw error;
  }
}

// Helper functions for note analysis
export const analyzeNote = async (content: string): Promise<string> => {
  const prompt = `Analyze the following note and provide a concise summary, key points, and improvement suggestions:
  
  ${content}
  
  Format your response as:
  
  SUMMARY:
  [A brief summary of the note]
  
  KEY POINTS:
  - [Key point 1]
  - [Key point 2]
  
  SUGGESTIONS:
  - [Suggestion 1]
  - [Suggestion 2]`;
  
  return callGeminiAI(prompt, content, 'analyze');
};

export const generateIdeas = async (content: string): Promise<string> => {
  const prompt = `Based on the following note, generate related ideas and thoughts that might help expand on this topic:
  
  ${content}
  
  Provide 5 interesting ideas or thoughts that relate to this content.`;
  
  return callGeminiAI(prompt, content, 'generate_ideas');
};

export const improveWriting = async (content: string): Promise<string> => {
  const prompt = `Improve the writing quality of the following note while preserving its meaning:
  
  ${content}
  
  Focus on clarity, conciseness, and professional tone. Return only the improved text.`;
  
  return callGeminiAI(prompt, content, 'improve_writing');
};

export const translateNote = async (content: string, targetLanguage: string): Promise<string> => {
  const prompt = `Translate the following text to ${targetLanguage}:
  
  ${content}
  
  Return only the translated text.`;
  
  return callGeminiAI(prompt, content, 'translate');
};

export const summarizeText = async (content: string): Promise<string> => {
  const prompt = `Summarize the following text into a concise, well-structured summary:
  
  ${content}
  
  Format your response with:
  - A brief overall summary paragraph (2-3 sentences)
  - Bullet points for key ideas (3-5 points)
  - A conclusion sentence`;
  
  return callGeminiAI(prompt, content, 'summarize');
};
