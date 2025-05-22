
// Utility functions for Gemini AI API via Supabase Edge Function
import { supabase } from "@/integrations/supabase/client";

// Types for AI requests
interface AIRequest {
  prompt: string;
  requestType: string;
  noteContent: string;
  imageUrl?: string;
  customPrompt?: string;
  privacyMode?: boolean; // Flag to indicate privacy protections are enabled
}

// Usage tracking for analytics and optimizing the user experience
// We don't enforce strict limits - users can continue using the service
const LOCAL_STORAGE_USAGE_KEY = 'oneai_gemini_usage';
const SOFT_USAGE_THRESHOLD = 100; // Soft threshold for usage notification
const PRIVACY_ACCEPTED_KEY = 'oneai_privacy_accepted';

// Privacy consent status - users should acknowledge AI limitations
export function hasAcceptedPrivacyDisclaimer(): boolean {
  try {
    return localStorage.getItem(PRIVACY_ACCEPTED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPrivacyDisclaimerAccepted(): void {
  try {
    localStorage.setItem(PRIVACY_ACCEPTED_KEY, 'true');
  } catch (e) {
    console.warn('Failed to save privacy consent', e);
  }
}

interface AIResponse {
  result?: string;
  error?: string;
}

// Check if user has high usage - for analytics only, we don't block usage
export function checkHighUsage(): boolean {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const usageData = localStorage.getItem(LOCAL_STORAGE_USAGE_KEY);
    let usage: Record<string, number> = {};
    
    if (usageData) {
      usage = JSON.parse(usageData);
    }
    
    // Clean up old dates (reset counters daily)
    Object.keys(usage).forEach(date => {
      if (date !== today) {
        delete usage[date];
      }
    });
    
    // Check today's usage - return true if usage is below threshold
    const todayCount = usage[today] || 0;
    return todayCount < SOFT_USAGE_THRESHOLD;
  } catch (e) {
    // If localStorage fails, default to allow
    console.warn('Failed to check usage', e);
    return true;
  }
}

// Increment usage counter
export function incrementUsageCounter(): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usageData = localStorage.getItem(LOCAL_STORAGE_USAGE_KEY);
    let usage: Record<string, number> = {};
    
    if (usageData) {
      usage = JSON.parse(usageData);
    }
    
    usage[today] = (usage[today] || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_USAGE_KEY, JSON.stringify(usage));
  } catch (e) {
    console.warn('Failed to update usage counter', e);
  }
}

// Main function to call Gemini AI via Supabase Edge Function
export async function callGeminiAI(
  prompt: string, 
  noteContent: string, 
  requestType: string, 
  imageUrl?: string,
  customPrompt?: string
): Promise<string> {
  try {
    // No strict rate limiting, just tracking usage
    const isHighUsage = !checkHighUsage();
    
    // Add privacy disclaimer to the prompt to ensure Gemini knows our privacy policy
    const privacyPrefix = "IMPORTANT: The following request is being made in accordance with our privacy policy. " +
                         "User content should not be retained longer than necessary to fulfill this request. " +
                         "No user data should be used for AI training.\n\n";
    
    // Only log high usage, but don't block any requests
    if (isHighUsage) {
      console.warn('High usage detected, but continuing to serve the user');
    }
    
    // Prepare request payload with privacy disclaimer
    const requestBody: AIRequest = {
      prompt: privacyPrefix + prompt,
      requestType,
      noteContent,
      imageUrl,
      customPrompt,
      privacyMode: true // Signal to backend that privacy protections are enabled
    };

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: JSON.stringify(requestBody),
    });
    
    // Increment usage counter on successful request
    incrementUsageCounter();

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
export const analyzeNote = async (
  content: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  // Use custom prompt if provided, otherwise use default
  const prompt = customPrompt || `Analyze the following ${imageUrl ? 'content/image' : 'note'} and provide a concise summary, key points, and improvement suggestions:
  
  ${content ? `Content:\n${content}` : ''}
  
  Format your response as:
  
  SUMMARY:
  [A brief summary]
  
  KEY POINTS:
  - [Key point 1]
  - [Key point 2]
  
  SUGGESTIONS:
  - [Suggestion 1]
  - [Suggestion 2]`;
  
  return callGeminiAI(prompt, content, 'analyze', imageUrl, customPrompt);
};

export const generateIdeas = async (
  content: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Based on the following ${imageUrl ? 'content/image' : 'note'}, generate related ideas and thoughts that might help expand on this topic:
  
  ${content ? `Content:\n${content}` : ''}
  
  Provide 5 interesting ideas or thoughts that relate to this content.`;
  
  return callGeminiAI(prompt, content, 'ideas', imageUrl, customPrompt);
};

export const improveWriting = async (
  content: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Improve the writing quality of the following ${imageUrl ? 'content based on the image' : 'note'} while preserving its meaning:
  
  ${content ? `Content:\n${content}` : ''}
  
  Focus on clarity, conciseness, and professional tone. Return only the improved text.`;
  
  return callGeminiAI(prompt, content, 'improve_writing', imageUrl, customPrompt);
};

export const translateNote = async (
  content: string, 
  targetLanguage: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Translate the following ${imageUrl ? 'content from the image' : 'text'} to ${targetLanguage}:
  
  ${content ? `Content:\n${content}` : ''}
  
  Return only the translated text.`;
  
  return callGeminiAI(prompt, content, 'translate', imageUrl, customPrompt);
};

export const summarizeText = async (
  content: string,
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Summarize the following ${imageUrl ? 'content from the image' : 'text'} into a concise version that captures the key points:
  
  ${content ? `Content:\n${content}` : ''}
  
  Make the summary about 25% of the original length. Return only the summarized text.`;
  
  return callGeminiAI(prompt, content, 'summarize', imageUrl, customPrompt);
};

// Get usage statistics for display to the user - we don't limit usage but still show stats
export function getUsageStats(): { used: number; limit: number; percent: number } {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usageData = localStorage.getItem(LOCAL_STORAGE_USAGE_KEY);
    let usage: Record<string, number> = {};
    
    if (usageData) {
      usage = JSON.parse(usageData);
    }
    
    const used = usage[today] || 0;
    // We show a higher limit to communicate that we're generous with usage
    // There's no hard limit, but we still want to show a progress indicator
    const displayLimit = 500; // Show a very generous limit
    const percent = Math.min(100, Math.round((used / displayLimit) * 100));
    
    return { used, limit: displayLimit, percent };
  } catch (e) {
    console.error('Failed to get usage stats', e);
    return { used: 0, limit: 500, percent: 0 };
  }
}

// AI disclaimer text for various components
export const AI_DISCLAIMERS = {
  general: "AI technology may produce inaccurate information. Review all outputs carefully.",
  images: "AI image analysis may miss important details or misinterpret visual content.",
  privacy: "We do not use your notes or images to train AI models. Your data is automatically deleted after 24 hours.",
  limitations: "Gemini AI is a probabilistic system and may occasionally generate incorrect, harmful, or misleading content.",
  accountability: "OneAI is responsible for the implementation of Gemini in this application, not Google."
};
