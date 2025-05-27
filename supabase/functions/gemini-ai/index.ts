
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
const GEMINI_MODEL = 'gemini-2.5-flash-preview-05-20';
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

// Enhanced request modes for Gemini 2.5 Flash
type RequestMode = 
  | 'thinking'           // Show step-by-step reasoning
  | 'structured'         // Return JSON structured data
  | 'multi_modal'        // Process text, images, audio
  | 'text_to_image'      // Generate images from text
  | 'long_context'       // Process very long documents
  | 'audio_to_text'      // Transcribe audio to text
  | 'video_analysis'     // Extract insights from videos
  | 'standard';          // Standard text generation

// Define flexible type for structured JSON data
type StructuredDataValue = string | number | boolean | null | StructuredDataObject | StructuredDataArray;
type StructuredDataObject = { [key: string]: StructuredDataValue };
type StructuredDataArray = StructuredDataValue[];

// Enhanced response interface for Gemini 2.5 Flash
interface Gemini25Response {
  result?: string;
  thinking?: string;
  structuredData?: StructuredDataObject;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Configuration for Gemini 2.5 Flash requests
interface Gemini25Config {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
  showThinking?: boolean;
  returnStructured?: boolean;
}

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
    
    // Extract request data - enhanced for Gemini 2.5 Flash
    const {
      prompt,
      requestMode = 'standard' as RequestMode, // New field for Gemini 2.5 Flash
      textContent, // For text content processing
      imageUrls = [], // For multi-modal processing (array of images)
      audioUrl, // For audio processing
      videoUrl, // For video processing
      config = {}, // Configuration options
      model = 'gemini-2.5-flash' // Model specification
    } = requestData;
    
    // For backward compatibility
    const { requestType, noteContent, imageUrl } = requestData;
    
    if (!prompt) {
      console.error('Missing prompt in request');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Use either requestMode (new) or requestType (legacy)
    const effectiveRequestMode = requestMode || (requestType as RequestMode) || 'standard';

    console.log(`Processing ${effectiveRequestMode} request with prompt: ${prompt.substring(0, 100)}...`);

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
    
    // Handle text content for Gemini 2.5 Flash (new format)
    if (textContent && textContent.trim()) {
      requestParts.push({ text: `\n\nContent:\n${textContent}` });
    } 
    // Handle legacy note content for backward compatibility
    else if (noteContent && noteContent.trim()) {
      requestParts.push({ text: `\n\nNote Content:\n${noteContent}` });
    }
    
    // Process multiple images for multi_modal mode
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      console.log(`Processing ${imageUrls.length} images for multi-modal analysis`);
      
      for (const imgUrl of imageUrls) {
        if (typeof imgUrl === 'string') {
          await processAndAddImage(imgUrl, requestParts);
        }
      }
    }
    // Handle single image for backward compatibility
    else if (imageUrl && typeof imageUrl === 'string') {
      console.log('Processing single image URL for backward compatibility');
      await processAndAddImage(imageUrl, requestParts);
    }
    
    // Process audio if provided
    if (audioUrl && typeof audioUrl === 'string' && effectiveRequestMode === 'audio_to_text') {
      console.log('Processing audio URL for transcription');
      await processAndAddAudio(audioUrl, requestParts);
    }
    
    // Process video if provided
    if (videoUrl && typeof videoUrl === 'string' && effectiveRequestMode === 'video_analysis') {
      console.log('Processing video URL for analysis');
      await processAndAddVideo(videoUrl, requestParts);
    }
    
    // Helper function to process and add image to request parts
    async function processAndAddImage(imageUrl: string, parts: ContentPart[]) {
      console.log('Processing image URL:', imageUrl.substring(0, 50) + '...');
      
      if (imageUrl.startsWith('data:image/')) {
        // Handle base64 image data
        try {
          const mimeType = imageUrl.match(/^data:([^;]+);base64,/)?.[1] || 'image/jpeg';
          const base64Image = imageUrl.replace(/^data:[^;]+;base64,/, '');
          
          parts.push({
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
            
            parts.push({
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
    
    // Helper function to process and add audio to request parts
    async function processAndAddAudio(audioUrl: string, parts: ContentPart[]) {
      // Audio handling is similar to image handling but with different MIME types
      if (audioUrl.startsWith('data:audio/')) {
        try {
          const mimeType = audioUrl.match(/^data:([^;]+);base64,/)?.[1] || 'audio/mp3';
          const base64Audio = audioUrl.replace(/^data:[^;]+;base64,/, '');
          
          parts.push({
            inline_data: {
              mime_type: mimeType,
              data: base64Audio
            }
          });
          
          console.log('Successfully processed base64 audio');
        } catch (error) {
          console.warn('Failed to process base64 audio:', error);
        }
      } else if (audioUrl.startsWith('http')) {
        try {
          const audioResponse = await fetch(audioUrl);
          if (audioResponse.ok) {
            const audioBuffer = await audioResponse.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
            const contentType = audioResponse.headers.get('content-type') || 'audio/mp3';
            
            parts.push({
              inline_data: {
                mime_type: contentType,
                data: base64Audio
              }
            });
            
            console.log('Successfully processed external audio');
          }
        } catch (error) {
          console.warn('Failed to fetch external audio:', error);
        }
      }
    }
    
    // Helper function to process and add video to request parts
    async function processAndAddVideo(videoUrl: string, parts: ContentPart[]) {
      // Video handling - similar to image/audio processing
      if (videoUrl.startsWith('data:video/')) {
        try {
          const mimeType = videoUrl.match(/^data:([^;]+);base64,/)?.[1] || 'video/mp4';
          const base64Video = videoUrl.replace(/^data:[^;]+;base64,/, '');
          
          parts.push({
            inline_data: {
              mime_type: mimeType,
              data: base64Video
            }
          });
          
          console.log('Successfully processed base64 video');
        } catch (error) {
          console.warn('Failed to process base64 video:', error);
        }
      } else if (videoUrl.startsWith('http')) {
        // For videos, we might want to extract frames or process differently
        // For now, we'll just add a note about the video URL
        parts.push({ 
          text: `\n\nVideo URL for analysis: ${videoUrl}\n` 
        });
        console.log('Added video URL reference for analysis');
      }
    }
    
    // Extract and apply configuration from the request
    const mergedConfig: Gemini25Config = {
      temperature: config.temperature ?? getTemperatureForRequestType(effectiveRequestMode),
      topP: config.topP ?? 0.95,
      topK: config.topK ?? 64, // Recommended value for Gemini 2.5 Flash
      maxOutputTokens: config.maxOutputTokens ?? 2048,
      showThinking: config.showThinking ?? (effectiveRequestMode === 'thinking'),
      returnStructured: config.returnStructured ?? (effectiveRequestMode === 'structured'),
      safetySettings: config.safetySettings,
      stopSequences: config.stopSequences
    };
    
    // Build Gemini request
    const geminiRequestBody: GeminiRequestBody = {
      contents: [{ parts: requestParts }],
      generationConfig: {
        temperature: mergedConfig.temperature ?? 0.7, // Default if undefined
        topP: mergedConfig.topP ?? 0.95, // Default if undefined
        topK: mergedConfig.topK ?? 64, // Default if undefined
        maxOutputTokens: mergedConfig.maxOutputTokens ?? 2048, // Default if undefined
      }
    };
    
    // Add system instruction based on request mode
    let systemInstructions: string | null = null;
    
    // Check for thinking mode
    if (mergedConfig.showThinking) {
      systemInstructions = `You are an advanced AI assistant with step-by-step thinking capabilities. 
      First, break down your reasoning process into clear, numbered steps. Think through the problem carefully, considering different angles.
      After your thinking process, provide your final answer/response.
      Format your response as follows:
      THINKING: <numbered steps of your reasoning process>
      ANSWER: <your final, concise response based on the thinking>`;
    }
    // Check for structured data mode
    else if (mergedConfig.returnStructured) {
      systemInstructions = `You are an expert at extracting structured information from text. 
      Extract the requested information and format it as a valid, well-structured JSON object.
      ONLY respond with the JSON object, nothing else - no explanations, no markdown formatting.
      Ensure the output is valid JSON that can be directly parsed.`;
    }
    // Use standard system instructions based on request mode/type
    else {
      systemInstructions = getSystemInstructionForRequestType(effectiveRequestMode);
    }
    
    if (systemInstructions) {
      geminiRequestBody.systemInstruction = {
        parts: [{ text: systemInstructions }]
      };
    }

    console.log('Calling Gemini API...');
    
    // Call Gemini API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout (increased)
    
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
    
    // Initialize the enhanced Gemini 2.5 Flash response
    const enhancedResponse: Gemini25Response = {};
    
    // Extract usage information if available
    if (data.usageMetadata) {
      enhancedResponse.usage = {
        promptTokens: data.usageMetadata.promptTokenCount || 0,
        completionTokens: data.usageMetadata.candidatesTokenCount || 0,
        totalTokens: (data.usageMetadata.promptTokenCount || 0) + (data.usageMetadata.candidatesTokenCount || 0)
      };
    }
    
    let rawText = '';
    
    // Extract text from response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      if (candidate.content?.parts && candidate.content.parts.length > 0) {
        const part = candidate.content.parts[0];
        if (part.text) {
          rawText = part.text;
        }
      }
    }

    if (!rawText) {
      console.error('No valid response text found in Gemini response');
      return new Response(
        JSON.stringify({ error: 'No valid response from Gemini API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process response based on request mode
    if (mergedConfig.showThinking) {
      // Process thinking mode response
      const thinkingMatch = rawText.match(/THINKING:\s*([\s\S]*?)\s*ANSWER:\s*([\s\S]*)/i);
      
      if (thinkingMatch && thinkingMatch.length >= 3) {
        enhancedResponse.thinking = thinkingMatch[1]?.trim();
        enhancedResponse.result = thinkingMatch[2]?.trim();
      } else {
        // Fallback if format isn't as expected
        enhancedResponse.result = rawText;
      }
    } else if (mergedConfig.returnStructured) {
      // Process structured data response
      try {
        // Try to parse JSON directly
        enhancedResponse.structuredData = JSON.parse(rawText.trim());
        enhancedResponse.result = "Structured data extracted successfully";
      } catch (jsonError) {
        // If direct parsing fails, try to extract JSON from text
        try {
          const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            enhancedResponse.structuredData = JSON.parse(jsonMatch[1].trim());
            enhancedResponse.result = "Structured data extracted successfully";
          } else {
            // Last resort: if it has curly braces, try to extract just that part
            const curlyMatch = rawText.match(/{[\s\S]*}/); 
            if (curlyMatch) {
              enhancedResponse.structuredData = JSON.parse(curlyMatch[0]);
              enhancedResponse.result = "Structured data extracted successfully";
            } else {
              throw new Error("Could not extract JSON from response");
            }
          }
        } catch (extractError) {
          console.error('Failed to extract structured data:', extractError);
          enhancedResponse.error = "Failed to extract structured data from response";
          enhancedResponse.result = rawText; // Return raw text as fallback
        }
      }
    } else if (effectiveRequestMode === 'text_to_image') {
      // For image generation, we return the text as a URL or data URI
      // Actual image generation would require integration with an image model
      enhancedResponse.result = rawText;
    } else {
      // Standard text response
      enhancedResponse.result = rawText;
    }

    console.log('Successfully processed request, returning enhanced response');
    
    return new Response(
      JSON.stringify(enhancedResponse),
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

// Get temperature for request mode/type
function getTemperatureForRequestType(requestMode: string): number {
  switch (requestMode) {
    // Gemini 2.5 Flash specific modes
    case 'thinking':
      return 0.2; // More precise for reasoning
    case 'structured':
      return 0.1; // Very precise for structured data
    case 'multi_modal':
      return 0.3; // Balanced for image analysis
    case 'text_to_image':
      return 0.8; // Creative for image generation
    case 'long_context':
      return 0.4; // Balanced for long documents
    case 'audio_to_text':
      return 0.1; // Precise for audio transcription
    case 'video_analysis':
      return 0.3; // Balanced for video analysis
      
    // Legacy request types
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
    case 'image_analyze':
      return 0.3; // Balanced for image analysis
    default:
      return 0.4; // Balanced default
  }
}

// Get system instruction for request type/mode
function getSystemInstructionForRequestType(requestMode: string): string | null {
  switch (requestMode) {
    // Gemini 2.5 Flash specific modes
    case 'multi_modal':
      return 'You are an expert at analyzing visual content combined with text. Provide detailed analysis of the images, considering both the visual elements and any textual context provided. Explain connections between text and images when relevant.';
      
    case 'text_to_image':
      return 'You are an expert at describing images for generation. Provide detailed, visually rich descriptions that could be used to generate images. Focus on visual elements, composition, lighting, style, and mood.';
      
    case 'long_context':
      return 'You are an expert at processing long documents. Maintain context across the entire document and provide comprehensive analysis while still being concise. Identify patterns, themes, and key points across the entire text.';
      
    case 'audio_to_text':
      return 'You are an expert transcriptionist. Accurately transcribe audio content, capturing not just words but also conveying tone, emotions, and non-verbal audio elements when relevant.';
      
    case 'video_analysis':
      return 'You are an expert at analyzing video content. Describe what you see in detail, including visual elements, scene changes, movement, audio components, and narrative structure. Provide timestamps for key moments when possible.';
    
    // Legacy request types
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
      
    case 'standard':
      return 'You are an intelligent assistant for a note-taking application. Provide helpful, concise, and accurate responses. Format your responses for readability when appropriate.';
      
    default:
      return 'You are an intelligent assistant for OneAI. Provide helpful, concise, and accurate responses based on the user\'s request.';
  }
}
