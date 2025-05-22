
// The next two imports use Deno modules, which require the deno.jsonc configuration
// The TypeScript errors are expected in the IDE but will not affect functionality
// @ts-expect-error - Deno module import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno module import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper function to safely access environment variables
const getEnv = (key: string): string => {
  try {
    // @ts-expect-error - Deno global is available at runtime in Supabase Edge Functions
    return Deno.env.get(key) || '';
  } catch (e) {
    console.error(`Error accessing environment variable ${key}:`, e);
    return '';
  }
};

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gemini API configuration
const GEMINI_MODEL = 'models/gemini-2.5-flash-preview-05-20';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_API_KEY = getEnv('GEMINI_API_KEY');

// Rate limiting and quota management to keep it free
const MAX_DAILY_REQUESTS = 200; // Adjust based on your expected usage
const REQUEST_MEMORY: { [ip: string]: number } = {};

// Function definitions for structured outputs
const NOTE_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'Brief summary of the note content' },
    keyPoints: { type: 'array', items: { type: 'string' }, description: 'List of key points from the note' },
    suggestions: { type: 'array', items: { type: 'string' }, description: 'Suggestions for improving the note' },
    topics: { type: 'array', items: { type: 'string' }, description: 'Main topics covered in the note' }
  },
  required: ['summary', 'keyPoints']
};

// Function definitions for function calling
const FUNCTION_DECLARATIONS = {
  analyze: {
    name: 'analyzeNote',
    description: 'Analyzes a note and provides structured feedback',
    parameters: NOTE_ANALYSIS_SCHEMA
  },
  summarize: {
    name: 'summarizeText',
    description: 'Summarizes the text into a concise version',
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Concise summary of the text' },
        wordCount: { type: 'number', description: 'Word count of the summary' }
      },
      required: ['summary']
    }
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { prompt, requestType, noteContent, imageUrl } = await req.json();
    
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit (simple implementation)
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Daily request limit reached. Please try again tomorrow.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare request for Gemini API with enhanced content
    const requestParts: ContentPart[] = [];
    
    // Add text prompt
    requestParts.push({ text: prompt });
    
    // Add note content if provided
    if (noteContent) {
      requestParts.push({ text: `\n\nNote Content:\n${noteContent}` });
    }
    
    // Add image if URL is provided
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
      try {
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
          requestParts.push({
            inline_data: {
              mime_type: imageResponse.headers.get('content-type') || 'image/jpeg',
              data: base64Image
            }
          });
        }
      } catch (error) {
        console.warn('Failed to fetch image:', error);
        // Continue without the image
      }
    }
    
// Define types at the file level for Gemini API parts and content
type ContentPart = { text?: string; inline_data?: { mime_type: string; data: string } };

// Define proper types for Gemini API request
interface GeminiRequestBody {
      contents: Array<{ parts: ContentPart[] }>;
      generationConfig: {
        temperature: number;
        topP: number;
        topK: number;
        maxOutputTokens: number;
      };
      tools?: Array<{
        function_declarations: Array<typeof FUNCTION_DECLARATIONS[keyof typeof FUNCTION_DECLARATIONS]>
      }>;
      tool_config?: {
        function_calling_config: {
          mode: 'AUTO' | 'NONE'
        }
      };
      systemInstruction?: {
        parts: Array<{ text: string }>
      };
    }
    
    // Base request configuration
    const requestBody: GeminiRequestBody = {
      contents: [{ parts: requestParts }],
      generationConfig: {
        temperature: getTemperatureForRequestType(requestType),
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      }
    };
    
    // Add structured output support for analysis and summarization
    if (['analyze', 'summarize'].includes(requestType)) {
      requestBody.tools = [{
        function_declarations: [FUNCTION_DECLARATIONS[requestType as 'analyze' | 'summarize']]
      }];
      
      // Enable function calling
      requestBody.tool_config = {
        function_calling_config: {
          mode: 'AUTO'
        }
      };
    }
    
    // Enable thinking capability for complex tasks
    if (['analyze', 'ideas', 'improve_writing'].includes(requestType)) {
      requestBody.systemInstruction = {
        parts: [{
          text: 'Think step by step. First understand the input thoroughly before generating your response.'
        }]
      };
    }

    // Log key information for debugging
    console.log(`Edge function starting for request type: ${requestType}`);
    console.log(`API URL: ${GEMINI_API_URL}/${GEMINI_MODEL}`);
    console.log(`API Key present: ${GEMINI_API_KEY ? 'Yes' : 'No - MISSING'}`); // Never log the actual key
    
    let response;
    try {
      // Call Gemini API with timeout
      console.log(`Calling Gemini API with ${requestType} prompt: ${prompt.substring(0, 50)}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      response = await fetch(
        `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Gemini API error: ${response.status}`, errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }
      
      console.log('Gemini API response received successfully');
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      throw new Error(`Error calling Gemini API: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`); 
    }
    
    if (!response) {
      throw new Error('Failed to get a response from Gemini API');
    }

    // Process Gemini API response with support for structured data
    const data = await response.json();
    let result = '';
    let structuredData = null;
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // Handle function calling responses
      if (candidate.content?.parts && candidate.content.parts.length > 0) {
        // Check for function call results
        if (candidate.content.parts[0].functionCall) {
          const functionCall = candidate.content.parts[0].functionCall;
          structuredData = JSON.parse(functionCall.args);
          
          // Format structured data for display
          // Type assertion for structured data
          interface AnalysisResult {
            summary: string;
            keyPoints: string[];
            suggestions?: string[];
            topics?: string[];
          }
          
          interface SummaryResult {
            summary: string;
          }
          
          if (requestType === 'analyze' && structuredData) {
            const analysis = structuredData as AnalysisResult;
            result = `SUMMARY:\n${analysis.summary}\n\nKEY POINTS:\n${analysis.keyPoints.map((point: string) => `- ${point}`).join('\n')}\n\nSUGGESTIONS:\n${analysis.suggestions?.map((suggestion: string) => `- ${suggestion}`).join('\n') || 'No suggestions provided.'}\n\nTOPICS:\n${analysis.topics?.map((topic: string) => `- ${topic}`).join('\n') || 'No topics identified.'}`;
          } else if (requestType === 'summarize' && structuredData) {
            const summary = structuredData as SummaryResult;
            result = summary.summary;
          }
        } else if (candidate.content.parts[0].text) {
          // Regular text response
          result = candidate.content.parts[0].text;
        }
      }
      
      // If thinking was enabled, include it in debug logs
      if (candidate.thinking) {
        console.log('AI Thinking Process:', candidate.thinking);
      }
    }

    if (!result) {
      throw new Error('No valid response from Gemini API');
    }

    // Return successful response
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Log and return error
    console.error('Error in gemini-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to get the appropriate temperature for each request type
// Check rate limit for a client
function checkRateLimit(clientIp: string): boolean {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `${clientIp}_${today}`;
  
  // Initialize counter if not exists
  if (!REQUEST_MEMORY[key]) {
    REQUEST_MEMORY[key] = 0;
  }
  
  // Increment and check
  REQUEST_MEMORY[key]++;
  return REQUEST_MEMORY[key] <= MAX_DAILY_REQUESTS;
}

function getTemperatureForRequestType(requestType: string): number {
  switch (requestType) {
    case 'analyze':
      return 0.2; // More factual and concise
    case 'summarize':
      return 0.1; // Very factual and concise for summarization
    case 'improve_writing':
      return 0.4; // Some creativity for better writing
    case 'translate':
      return 0.1; // More literal for translation
    case 'generate_ideas':
      return 0.7; // More creative for idea generation
    default:
      return 0.4; // Default temperature
  }
}
