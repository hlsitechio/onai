// OneAI Notes - Gemini AI Edge Function
// File: supabase/functions/gemini-ai/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeminiRequest {
  prompt: string;
  action: 'generate' | 'enhance' | 'summarize' | 'translate' | 'expand';
  context?: string;
  targetLanguage?: string;
  temperature?: number;
  maxTokens?: number;
}

interface GeminiResponse {
  success: boolean;
  content?: string;
  error?: string;
  tokensUsed?: number;
  processingTime?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Parse request body
    const { prompt, action, context, targetLanguage, temperature = 0.7, maxTokens = 2000 }: GeminiRequest = await req.json()

    if (!prompt) {
      throw new Error('Prompt is required')
    }

    // Rate limiting check
    const { data: recentRequests, error: rateLimitError } = await supabaseClient
      .from('ai_requests')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (rateLimitError) {
      throw new Error('Rate limit check failed')
    }

    if (recentRequests && recentRequests.length >= 100) {
      throw new Error('Daily AI request limit exceeded')
    }

    // Prepare system prompt based on action
    let systemPrompt = ''
    switch (action) {
      case 'enhance':
        systemPrompt = 'You are a writing assistant. Improve the grammar, style, and clarity of the provided text while maintaining its original meaning and tone.'
        break
      case 'summarize':
        systemPrompt = 'You are a summarization expert. Create a concise summary that captures the main points and key information from the provided text.'
        break
      case 'translate':
        systemPrompt = `You are a professional translator. Translate the provided text to ${targetLanguage || 'English'} while preserving meaning, tone, and context.`
        break
      case 'expand':
        systemPrompt = 'You are a creative writing assistant. Expand on the provided ideas with additional details, examples, and related concepts.'
        break
      default:
        systemPrompt = 'You are a helpful AI assistant. Respond to the user\'s request in a clear and helpful manner.'
    }

    // Prepare the full prompt
    const fullPrompt = context 
      ? `${systemPrompt}\n\nContext: ${context}\n\nUser request: ${prompt}`
      : `${systemPrompt}\n\nUser request: ${prompt}`

    // Call Gemini API
    const startTime = Date.now()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxTokens,
            topP: 0.8,
            topK: 10
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()
      throw new Error(`Gemini API error: ${errorData}`)
    }

    const geminiData = await geminiResponse.json()
    const processingTime = Date.now() - startTime

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error('No response generated from Gemini')
    }

    const generatedContent = geminiData.candidates[0].content.parts[0].text
    const tokensUsed = geminiData.usageMetadata?.totalTokenCount || 0

    // Log the AI request
    const { error: logError } = await supabaseClient
      .from('ai_requests')
      .insert({
        user_id: user.id,
        prompt: prompt,
        response: generatedContent,
        tokens_used: tokensUsed,
        processing_time: processingTime,
        status: 'completed'
      })

    if (logError) {
      console.error('Failed to log AI request:', logError)
    }

    // Update user AI request count
    const { error: updateError } = await supabaseClient
      .from('users')
      .update({ 
        ai_requests_count: supabaseClient.sql`ai_requests_count + 1`
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update user AI request count:', updateError)
    }

    const response: GeminiResponse = {
      success: true,
      content: generatedContent,
      tokensUsed,
      processingTime
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Gemini AI function error:', error)
    
    const errorResponse: GeminiResponse = {
      success: false,
      error: error.message
    }

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

