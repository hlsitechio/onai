// Utility functions for Gemini AI API via Supabase Edge Function
import { supabase } from "@/integrations/supabase/client";

// Types for AI requests
interface AIRequest {
  prompt: string;
  requestType: string;
  noteContent: string;
  imageUrl?: string;
  customPrompt?: string;
  privacyMode?: boolean;
}

// Usage tracking for analytics and optimizing the user experience
const LOCAL_STORAGE_USAGE_KEY = 'oneai_gemini_usage';
const SOFT_USAGE_THRESHOLD = 100;
const PRIVACY_ACCEPTED_KEY = 'oneai_privacy_accepted';

// Privacy consent status
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

// Check if user has high usage
export function checkHighUsage(): boolean {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usageData = localStorage.getItem(LOCAL_STORAGE_USAGE_KEY);
    let usage: Record<string, number> = {};
    
    if (usageData) {
      usage = JSON.parse(usageData);
    }
    
    // Clean up old dates
    Object.keys(usage).forEach(date => {
      if (date !== today) {
        delete usage[date];
      }
    });
    
    const todayCount = usage[today] || 0;
    return todayCount < SOFT_USAGE_THRESHOLD;
  } catch (e) {
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

// Updated function to check usage limits with subscription
export async function checkAIUsageLimit(): Promise<{ canMakeRequest: boolean; reason?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { canMakeRequest: false, reason: 'User not authenticated' };
    }

    // Check if user can make AI request using the database function
    const { data: canMakeRequest, error } = await supabase
      .rpc('can_make_ai_request', { user_uuid: user.id });

    if (error) {
      console.error('Error checking AI usage limit:', error);
      return { canMakeRequest: true }; // Allow request if check fails
    }

    if (!canMakeRequest) {
      // Get subscription info to provide specific reason
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      const tier = subscriber?.subscription_tier || 'starter';
      const limit = tier === 'professional' ? 500 : 10;
      
      return { 
        canMakeRequest: false, 
        reason: `Daily limit of ${limit} AI requests reached. ${tier === 'starter' ? 'Upgrade to Professional for 500 daily requests.' : ''}` 
      };
    }

    return { canMakeRequest: true };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { canMakeRequest: true }; // Allow request if check fails
  }
}

// Updated function to track AI usage
export async function trackAIUsage(requestType: string, tokensUsed: number = 0): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Cannot track AI usage: user not authenticated');
      return;
    }

    // Get user's subscription tier
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .single();

    const tier = subscriber?.subscription_tier || 'starter';

    await supabase
      .from('ai_usage_tracking')
      .insert({
        user_id: user.id,
        request_type: requestType,
        tokens_used: tokensUsed,
        subscription_tier: tier,
      });
  } catch (error) {
    console.error('Error tracking AI usage:', error);
  }
}

// Main function to call Gemini AI via Supabase Edge Function (updated with better error handling)
export async function callGeminiAI(
  prompt: string, 
  noteContent: string, 
  requestType: string, 
  imageUrl?: string,
  customPrompt?: string
): Promise<string> {
  try {
    console.log('Calling Gemini AI with:', { requestType, prompt: prompt.substring(0, 50) + '...', hasImage: !!imageUrl });
    
    // Check usage limits before making request
    const { canMakeRequest, reason } = await checkAIUsageLimit();
    
    if (!canMakeRequest) {
      throw new Error(reason || 'Daily AI request limit reached');
    }
    
    // Validate inputs
    if (!prompt && !customPrompt) {
      throw new Error('No prompt provided');
    }
    
    if (!requestType) {
      throw new Error('Request type is required');
    }

    // Privacy disclaimer prefix
    const privacyPrefix = "IMPORTANT: This request follows our privacy policy. User content should not be retained or used for training.\n\n";
    
    // Create a more concise prompt to avoid token limits
    const cleanPrompt = (customPrompt || prompt).replace(privacyPrefix, '');
    const finalPrompt = privacyPrefix + cleanPrompt;
    
    // Prepare request payload
    const requestBody: AIRequest = {
      prompt: finalPrompt,
      requestType,
      noteContent: noteContent || "",
      imageUrl,
      customPrompt,
      privacyMode: true
    };

    console.log('Sending request to Supabase function:', requestBody);

    // Call the Supabase Edge Function with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`AI service error: ${error.message || 'Unknown error occurred'}`);
      }
      
      if (!data) {
        throw new Error('No data received from AI service');
      }
      
      // Track usage on success
      await trackAIUsage(requestType, 0);
      
      return processAIResponse(data as AIResponse);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
      }
      if (error.message.includes('Content Security Policy')) {
        return "The AI service is temporarily unavailable due to security restrictions. Please try again later.";
      }
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        return "The AI service took too long to respond. Please try again with simpler content.";
      }
      if (error.message.includes('AI service error')) {
        return `AI processing failed: ${error.message}. Please try again with shorter text.`;
      }
      return `AI processing failed: ${error.message}`;
    }
    
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
}

// Helper function to process AI response with better error handling
function processAIResponse(response: AIResponse): string {
  if (response.error) {
    console.error(`AI processing error: ${response.error}`);
    throw new Error(response.error);
  }
  
  if (!response.result || response.result.trim() === '') {
    console.error('No valid response received from AI');
    throw new Error('The AI service returned an empty response. Please try again with different text.');
  }
  
  return response.result.trim();
}

// Helper functions for note analysis
export const analyzeNote = async (
  content: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Analyze the following ${imageUrl ? 'content and image' : 'note'} and provide insights:

${content ? `Content:\n${content}` : ''}

Please provide:
1. SUMMARY: A brief overview
2. KEY POINTS: Main takeaways (bullet points)  
3. SUGGESTIONS: Recommendations for improvement
4. INSIGHTS: Additional observations

Format your response clearly with headers.`;
  
  return callGeminiAI(prompt, content, 'analyze', imageUrl, customPrompt);
};

export const generateIdeas = async (
  content: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Based on the following ${imageUrl ? 'content and image' : 'note'}, generate creative ideas and suggestions:

${content ? `Content:\n${content}` : ''}

Please provide:
- 5-7 related ideas or concepts
- Potential directions to explore
- Creative connections and associations
- Actionable next steps

Be creative and think outside the box while staying relevant to the content.`;
  
  return callGeminiAI(prompt, content, 'ideas', imageUrl, customPrompt);
};

export const improveWriting = async (
  content: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Improve the writing quality of the following ${imageUrl ? 'content (consider the image context)' : 'text'}:

${content ? `Content:\n${content}` : ''}

Please:
- Enhance clarity and readability
- Improve grammar and style
- Maintain the original meaning and tone
- Make it more engaging and professional

Return the improved version of the text.`;
  
  return callGeminiAI(prompt, content, 'improve_writing', imageUrl, customPrompt);
};

export const translateNote = async (
  content: string, 
  targetLanguage: string, 
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Translate the following ${imageUrl ? 'content (consider image context)' : 'text'} to ${targetLanguage}:

${content ? `Content:\n${content}` : ''}

Requirements:
- Maintain the original meaning and context
- Use natural, fluent ${targetLanguage}
- Preserve formatting where possible
- Keep technical terms accurate

Provide only the translated text.`;
  
  return callGeminiAI(prompt, content, 'translate', imageUrl, customPrompt);
};

export const summarizeText = async (
  content: string,
  imageUrl?: string, 
  customPrompt?: string
): Promise<string> => {
  const prompt = customPrompt || `Summarize the following ${imageUrl ? 'content and image' : 'text'} into a concise version:

${content ? `Content:\n${content}` : ''}

Please create:
- A clear, concise summary (about 25% of original length)
- Capture all key points and main ideas
- Maintain important details
- Use clear, accessible language

Provide only the summarized text.`;
  
  return callGeminiAI(prompt, content, 'summarize', imageUrl, customPrompt);
};

// Get usage statistics
export function getUsageStats(): { used: number; limit: number; percent: number } {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usageData = localStorage.getItem(LOCAL_STORAGE_USAGE_KEY);
    let usage: Record<string, number> = {};
    
    if (usageData) {
      usage = JSON.parse(usageData);
    }
    
    const used = usage[today] || 0;
    const displayLimit = 500;
    const percent = Math.min(100, Math.round((used / displayLimit) * 100));
    
    return { used, limit: displayLimit, percent };
  } catch (e) {
    console.error('Failed to get usage stats', e);
    return { used: 0, limit: 500, percent: 0 };
  }
}

// AI disclaimer text
export const AI_DISCLAIMERS = {
  general: "AI technology may produce inaccurate information. Review all outputs carefully.",
  images: "AI image analysis may miss important details or misinterpret visual content.",
  privacy: "We do not use your notes or images to train AI models. Your data is automatically deleted after 24 hours.",
  limitations: "Gemini AI is a probabilistic system and may occasionally generate incorrect, harmful, or misleading content.",
  accountability: "OneAI is responsible for the implementation of Gemini in this application, not Google."
};
