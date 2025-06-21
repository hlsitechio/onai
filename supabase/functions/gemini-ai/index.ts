
// @ts-expect-error - Deno module import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno module import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper function to safely access environment variables
const getEnv = (key: string): string => {
  try {
    // @ts-expect-error - Deno global is available at runtime
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

// Gemini API configuration - UPDATED TO 2.5 FLASH
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_API_KEY = getEnv('GEMINI_API_KEY');

// Rate limiting
const MAX_DAILY_REQUESTS = 500;
const REQUEST_MEMORY: { [ip: string]: number } = {};

// Define types for Gemini API
type ContentPart = { 
  text?: string; 
  inline_data?: { mime_type: string; data: string } 
};

interface GeminiRequestBody {
  contents: Array<{ parts: ContentPart[] }>;
  generationConfig: {
    temperature: number;
    topP: number;
    topK?: number;
    maxOutputTokens: number;
  };
  systemInstruction?: {
    parts: Array<{ text: string }>
  };
}

serve(async (req) => {
  console.log(`${req.method} request received to gemini-ai function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check API key
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in Supabase Edge Function Secrets.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let requestData;
    try {
      const body = await req.text();
      console.log('Raw request body:', body);
      requestData = JSON.parse(body);
      console.log('Parsed request data:', requestData);
    } catch (parseError) {
      console.error('Error parsing request JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { prompt, requestType, noteContent, imageUrl } = requestData;
    
    if (!prompt) {
      console.error('Missing prompt in request');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!requestType) {
      console.error('Missing requestType in request');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: requestType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${requestType} request with prompt: ${prompt.substring(0, 100)}...`);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: 'Daily request limit reached. Please try again tomorrow.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare request parts
    const requestParts: ContentPart[] = [];
    
    // Add main prompt
    requestParts.push({ text: prompt });
    
    // Add note content if provided
    if (noteContent && noteContent.trim()) {
      requestParts.push({ text: `\n\nNote Content:\n${noteContent}` });
    }
    
    // Handle image if provided
    if (imageUrl && typeof imageUrl === 'string') {
      console.log('Processing image URL:', imageUrl.substring(0, 50) + '...');
      
      if (imageUrl.startsWith('data:image/')) {
        // Handle base64 image data
        try {
          const mimeType = imageUrl.match(/^data:([^;]+);base64,/)?.[1] || 'image/jpeg';
          const base64Image = imageUrl.replace(/^data:[^;]+;base64,/, '');
          
          requestParts.push({
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          });
          
          console.log('Successfully processed base64 image');
        } catch (error) {
          console.warn('Failed to process base64 image:', error);
        }
      } else if (imageUrl.startsWith('http')) {
        // Handle external image URL
        try {
          console.log('Fetching external image...');
          const imageResponse = await fetch(imageUrl);
          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
            const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
            
            requestParts.push({
              inline_data: {
                mime_type: contentType,
                data: base64Image
              }
            });
            
            console.log('Successfully processed external image');
          } else {
            console.warn(`Failed to fetch image, status: ${imageResponse.status}`);
          }
        } catch (error) {
          console.warn('Failed to fetch external image:', error);
        }
      }
    }
    
    // Build Gemini request
    const geminiRequestBody: GeminiRequestBody = {
      contents: [{ parts: requestParts }],
      generationConfig: {
        temperature: getTemperatureForRequestType(requestType),
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    };
    
    // Add system instruction for better results
    const systemInstructions = getSystemInstructionForRequestType(requestType);
    if (systemInstructions) {
      geminiRequestBody.systemInstruction = {
        parts: [{ text: systemInstructions }]
      };
    }

    console.log('Calling Gemini API...');
    
    // Call Gemini API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const apiUrl = `${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geminiRequestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error ${response.status}:`, errorText);
      
      let errorMessage = `Gemini API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        // Use default error message
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Gemini API response received successfully');
    
    // Process response
    const data = await response.json();
    console.log('Gemini response data:', JSON.stringify(data, null, 2));
    
    let result = '';
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      if (candidate.content?.parts && candidate.content.parts.length > 0) {
        const part = candidate.content.parts[0];
        if (part.text) {
          result = part.text;
        }
      }
    }

    if (!result) {
      console.error('No valid response text found in Gemini response');
      return new Response(
        JSON.stringify({ error: 'No valid response from Gemini API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully processed request, returning result');
    
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in gemini-ai function:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The operation took too long to complete.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Check rate limit for a client
function checkRateLimit(clientIp: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const key = `${clientIp}_${today}`;
  
  if (!REQUEST_MEMORY[key]) {
    REQUEST_MEMORY[key] = 0;
  }
  
  REQUEST_MEMORY[key]++;
  return REQUEST_MEMORY[key] <= MAX_DAILY_REQUESTS;
}

// Get temperature for request type
function getTemperatureForRequestType(requestType: string): number {
  switch (requestType) {
    case 'analyze':
    case 'summarize':
      return 0.2; // More factual
    case 'translate':
      return 0.1; // Very literal
    case 'improve_writing':
      return 0.4; // Some creativity
    case 'ideas':
    case 'generate_ideas':
      return 0.7; // More creative
    case 'chat':
      return 0.6; // Conversational and creative
    default:
      return 0.4;
  }
}

// Get system instruction for request type
function getSystemInstructionForRequestType(requestType: string): string | null {
  switch (requestType) {
    case 'analyze':
      return 'You are an expert analyst. Provide clear, structured analysis with specific insights. Use headings and bullet points for better readability.';
    case 'ideas':
    case 'generate_ideas':
      return 'You are a creative ideation expert. Generate diverse, actionable ideas that are both creative and practical. Think outside the box while staying relevant.';
    case 'improve_writing':
      return 'You are a professional editor and writing coach. Improve clarity, flow, grammar, and style while preserving the author\'s voice and intent.';
    case 'translate':
      return 'You are a professional translator. Provide accurate, natural translations that preserve meaning, tone, and cultural context.';
    case 'summarize':
      return 'You are a summarization expert. Create concise, comprehensive summaries that capture all key points and main ideas.';
    case 'image_analyze':
      return 'You are an expert at analyzing images. Describe what you see in detail, including objects, people, text, colors, composition, and any relevant context.';
    case 'chat':
      return 'You are a helpful, knowledgeable assistant. Provide clear, accurate, and engaging responses. Be conversational but professional. If asked about writing or editing, focus on being helpful and constructive.';
    default:
      return 'You are a helpful assistant. Provide clear, accurate, and useful responses to user queries.';
  }
}
