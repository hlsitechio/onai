
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get API keys
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

interface AIRequest {
  prompt: string;
  requestType: string;
  noteContent?: string;
  imageUrl?: string;
  userId?: string;
  preferredProvider?: 'gemini' | 'openai';
}

serve(async (req) => {
  console.log(`${req.method} request received to enhanced-ai-processor function`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: AIRequest = await req.json();
    const { prompt, requestType, noteContent, imageUrl, userId, preferredProvider } = requestData;
    
    if (!prompt || !requestType) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: prompt and requestType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${requestType} request with provider preference: ${preferredProvider}`);

    // Log the AI interaction
    if (userId) {
      try {
        await supabase
          .from('ai_interactions')
          .insert({
            user_id: userId,
            note_content: noteContent || '',
            request_type: requestType,
            response: null // Will be updated after processing
          });
      } catch (logError) {
        console.warn('Failed to log AI interaction:', logError);
      }
    }

    let result = '';
    let provider = '';

    // Try preferred provider first, then fallback
    if (preferredProvider === 'gemini' && geminiApiKey) {
      const geminiResult = await processWithGemini(prompt, requestType, noteContent, imageUrl);
      if (geminiResult.success) {
        result = geminiResult.result;
        provider = 'gemini';
      }
    } else if (preferredProvider === 'openai' && openaiApiKey) {
      const openaiResult = await processWithOpenAI(prompt, requestType, noteContent, imageUrl);
      if (openaiResult.success) {
        result = openaiResult.result;
        provider = 'openai';
      }
    }

    // Fallback logic
    if (!result) {
      if (geminiApiKey) {
        const geminiResult = await processWithGemini(prompt, requestType, noteContent, imageUrl);
        if (geminiResult.success) {
          result = geminiResult.result;
          provider = 'gemini';
        }
      }
      
      if (!result && openaiApiKey) {
        const openaiResult = await processWithOpenAI(prompt, requestType, noteContent, imageUrl);
        if (openaiResult.success) {
          result = openaiResult.result;
          provider = 'openai';
        }
      }
    }

    if (!result) {
      throw new Error('No AI providers available or all failed');
    }

    console.log(`Successfully processed request with ${provider}`);
    
    return new Response(
      JSON.stringify({ result, provider }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in enhanced-ai-processor function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processWithGemini(prompt: string, requestType: string, noteContent?: string, imageUrl?: string) {
  try {
    const response = await supabase.functions.invoke('gemini-ai', {
      body: { prompt, requestType, noteContent, imageUrl }
    });

    if (response.error) {
      throw response.error;
    }

    return { success: true, result: response.data.result };
  } catch (error) {
    console.error('Gemini processing failed:', error);
    return { success: false, error };
  }
}

async function processWithOpenAI(prompt: string, requestType: string, noteContent?: string, imageUrl?: string) {
  if (!openaiApiKey) {
    return { success: false, error: 'OpenAI API key not configured' };
  }

  try {
    const messages = [
      {
        role: 'system',
        content: getSystemPromptForRequestType(requestType)
      },
      {
        role: 'user',
        content: noteContent ? `${prompt}\n\nContext: ${noteContent}` : prompt
      }
    ];

    // Add image if provided
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      messages[1].content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } }
      ];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: getTemperatureForRequestType(requestType),
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    return { success: true, result };
  } catch (error) {
    console.error('OpenAI processing failed:', error);
    return { success: false, error };
  }
}

function getSystemPromptForRequestType(requestType: string): string {
  switch (requestType) {
    case 'analyze':
      return 'You are an expert analyst. Provide clear, structured analysis with specific insights.';
    case 'ideas':
    case 'generate_ideas':
      return 'You are a creative ideation expert. Generate diverse, actionable ideas.';
    case 'improve_writing':
      return 'You are a professional editor. Improve clarity, flow, and style while preserving the author\'s voice.';
    case 'translate':
      return 'You are a professional translator. Provide accurate, natural translations.';
    case 'summarize':
      return 'You are a summarization expert. Create concise, comprehensive summaries.';
    default:
      return 'You are a helpful AI assistant. Provide clear, accurate, and useful responses.';
  }
}

function getTemperatureForRequestType(requestType: string): number {
  switch (requestType) {
    case 'analyze':
    case 'summarize':
      return 0.2;
    case 'translate':
      return 0.1;
    case 'improve_writing':
      return 0.4;
    case 'ideas':
    case 'generate_ideas':
      return 0.7;
    default:
      return 0.4;
  }
}
