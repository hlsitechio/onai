
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisionResponse {
  responses: Array<{
    fullTextAnnotation?: {
      text: string;
      pages: Array<{
        confidence: number;
        blocks: Array<{
          boundingBox: any;
          confidence: number;
          paragraphs: Array<{
            boundingBox: any;
            confidence: number;
            words: Array<{
              boundingBox: any;
              confidence: number;
              symbols: Array<{
                text: string;
                confidence: number;
              }>;
            }>;
          }>;
        }>;
      }>;
    };
    textAnnotations?: Array<{
      description: string;
      boundingPoly: any;
    }>;
    error?: {
      code: number;
      message: string;
    };
  }>;
}

serve(async (req) => {
  console.log(`${req.method} request received to google-vision-ocr function`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');
    if (!apiKey) {
      console.error('GOOGLE_CLOUD_VISION_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Google Cloud Vision API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageData, features = ['TEXT_DETECTION'], language = 'en' } = await req.json();
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'No image data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing image with Google Vision API...');

    // Prepare the request for Google Vision API
    const visionRequest = {
      requests: [
        {
          image: {
            content: imageData.replace(/^data:image\/[^;]+;base64,/, '')
          },
          features: features.map(feature => ({ type: feature, maxResults: 50 })),
          imageContext: {
            languageHints: [language]
          }
        }
      ]
    };

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visionRequest)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Vision API error:', errorText);
      throw new Error(`Google Vision API error: ${response.status} - ${errorText}`);
    }

    const data: VisionResponse = await response.json();
    console.log('Google Vision API response received');

    if (data.responses[0]?.error) {
      throw new Error(`Vision API error: ${data.responses[0].error.message}`);
    }

    const result = data.responses[0];
    
    // Extract text with confidence scores
    let extractedText = '';
    let confidence = 0;
    let structuredData = null;

    if (result.fullTextAnnotation) {
      extractedText = result.fullTextAnnotation.text.trim();
      
      // Calculate average confidence
      if (result.fullTextAnnotation.pages?.length > 0) {
        const totalConfidence = result.fullTextAnnotation.pages.reduce((sum, page) => sum + (page.confidence || 0), 0);
        confidence = totalConfidence / result.fullTextAnnotation.pages.length;
      }

      // Structure data for advanced processing
      structuredData = {
        pages: result.fullTextAnnotation.pages,
        blocks: result.fullTextAnnotation.pages?.flatMap(page => page.blocks) || [],
        paragraphs: result.fullTextAnnotation.pages?.flatMap(page => 
          page.blocks.flatMap(block => block.paragraphs)
        ) || []
      };
    } else if (result.textAnnotations?.length > 0) {
      extractedText = result.textAnnotations[0].description.trim();
      confidence = 0.8; // Default confidence for text annotations
    }

    if (!extractedText) {
      return new Response(
        JSON.stringify({ 
          text: '', 
          confidence: 0, 
          message: 'No text detected in the image',
          structuredData: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        text: extractedText, 
        confidence: Math.round(confidence * 100),
        structuredData,
        provider: 'google-vision'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in google-vision-ocr function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        provider: 'google-vision'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
