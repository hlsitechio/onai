
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  content: string;
  operation: 'summarize' | 'translate' | 'sentiment' | 'keywords';
  targetLanguage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, operation, targetLanguage }: ContentRequest = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    console.log(`Processing ${operation} operation for content length: ${content.length}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let prompt = '';
    switch (operation) {
      case 'summarize':
        prompt = `Summarize the following content in 2-3 sentences:\n\n${content}`;
        break;
      case 'translate':
        prompt = `Translate the following content to ${targetLanguage || 'Spanish'}:\n\n${content}`;
        break;
      case 'sentiment':
        prompt = `Analyze the sentiment of this content and return only: positive, negative, or neutral:\n\n${content}`;
        break;
      case 'keywords':
        prompt = `Extract 5-10 key terms from this content, return as comma-separated list:\n\n${content}`;
        break;
      default:
        throw new Error('Invalid operation');
    }

    // Call Gemini AI via existing function
    const { data: aiResult, error: aiError } = await supabase.functions.invoke('gemini-ai', {
      body: JSON.stringify({
        prompt,
        requestType: operation,
        noteContent: content,
      }),
    });

    if (aiError) {
      throw new Error(`AI processing failed: ${aiError.message}`);
    }

    // Log the interaction
    const { error: logError } = await supabase
      .from('ai_interactions')
      .insert({
        request_type: operation,
        note_content: content.substring(0, 1000), // Limit content length
        response: aiResult.result?.substring(0, 1000),
      });

    if (logError) {
      console.error('Failed to log interaction:', logError);
    }

    return new Response(
      JSON.stringify({
        operation,
        result: aiResult.result,
        processedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-content-processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
