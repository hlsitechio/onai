
// Utility functions for Gemini AI API

// Configuration for Gemini API
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Will be replaced with proper API key management
const GEMINI_MODEL = 'models/gemini-2.5-flash-preview-05-20';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Types for Gemini API
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: any;
}

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

// Function to call Gemini API
export async function callGeminiAI(prompt: string): Promise<string> {
  try {
    // Prepare request body
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    // Make API call
    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json() as GeminiResponse;
    
    // Extract text from response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    throw new Error('No valid response from Gemini API');
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
  
  return callGeminiAI(prompt);
};

export const generateIdeas = async (content: string): Promise<string> => {
  const prompt = `Based on the following note, generate related ideas and thoughts that might help expand on this topic:
  
  ${content}
  
  Provide 5 interesting ideas or thoughts that relate to this content.`;
  
  return callGeminiAI(prompt);
};

export const improveWriting = async (content: string): Promise<string> => {
  const prompt = `Improve the writing quality of the following note while preserving its meaning:
  
  ${content}
  
  Focus on clarity, conciseness, and professional tone. Return only the improved text.`;
  
  return callGeminiAI(prompt);
};

export const translateNote = async (content: string, targetLanguage: string): Promise<string> => {
  const prompt = `Translate the following text to ${targetLanguage}:
  
  ${content}
  
  Return only the translated text.`;
  
  return callGeminiAI(prompt);
};

