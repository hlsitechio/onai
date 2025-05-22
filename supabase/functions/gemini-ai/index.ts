
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gemini API configuration
const GEMINI_MODEL = 'models/gemini-2.5-flash-preview-05-20';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { prompt, requestType, noteContent } = await req.json();

    // Prepare request for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      // Add specific configurations based on request type
      generationConfig: {
        temperature: getTemperatureForRequestType(requestType),
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      }
    };

    // Call Gemini API
    console.log(`Calling Gemini API with ${requestType} prompt: ${prompt.substring(0, 50)}...`);
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

    // Process Gemini API response
    const data = await response.json();
    let result = '';
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        result = candidate.content.parts[0].text;
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
