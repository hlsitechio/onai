
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileRequest {
  fileData: string; // base64 encoded file
  fileName: string;
  operation: 'extract_text' | 'analyze_image' | 'convert_format' | 'compress';
  options?: {
    quality?: number;
    format?: string;
    language?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, operation, options }: FileRequest = await req.json();

    if (!fileData || !fileName) {
      throw new Error('File data and name are required');
    }

    console.log(`Processing file: ${fileName} with operation: ${operation}`);

    // Decode base64 file data
    const fileBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    let result: any = {};

    switch (operation) {
      case 'extract_text': {
        if (!['pdf', 'txt', 'md', 'json'].includes(fileExtension || '')) {
          throw new Error('Text extraction only supports PDF, TXT, MD, and JSON files');
        }

        if (fileExtension === 'txt' || fileExtension === 'md') {
          const text = new TextDecoder().decode(fileBuffer);
          result = {
            text,
            wordCount: text.split(/\s+/).length,
            characterCount: text.length,
            lineCount: text.split('\n').length,
          };
        } else if (fileExtension === 'json') {
          const text = new TextDecoder().decode(fileBuffer);
          try {
            const parsed = JSON.parse(text);
            result = {
              text: JSON.stringify(parsed, null, 2),
              structure: analyzeJSONStructure(parsed),
              isValid: true,
            };
          } catch {
            result = {
              text,
              isValid: false,
              error: 'Invalid JSON format',
            };
          }
        } else {
          // For PDF, we'd need a specialized library
          result = {
            text: '[PDF text extraction requires additional processing]',
            message: 'PDF text extraction is not yet implemented',
          };
        }
        break;
      }

      case 'analyze_image': {
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
          throw new Error('Image analysis only supports JPG, PNG, GIF, and WebP files');
        }

        // For image analysis, we'd typically use Google Vision API
        // For now, return basic file info
        result = {
          fileName,
          fileSize: fileBuffer.length,
          format: fileExtension,
          dimensions: '[Image dimension analysis requires additional processing]',
          analysis: 'Image content analysis is not yet implemented',
          suggestedTags: ['image', 'upload'],
        };
        break;
      }

      case 'convert_format': {
        const targetFormat = options?.format || 'txt';
        
        if (fileExtension === 'json' && targetFormat === 'txt') {
          const jsonText = new TextDecoder().decode(fileBuffer);
          try {
            const parsed = JSON.parse(jsonText);
            const converted = convertJSONToText(parsed);
            result = {
              convertedData: btoa(converted),
              originalFormat: fileExtension,
              targetFormat,
              success: true,
            };
          } catch {
            throw new Error('Invalid JSON for conversion');
          }
        } else if (fileExtension === 'md' && targetFormat === 'txt') {
          const mdText = new TextDecoder().decode(fileBuffer);
          const converted = mdText.replace(/[#*`_~]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
          result = {
            convertedData: btoa(converted),
            originalFormat: fileExtension,
            targetFormat,
            success: true,
          };
        } else {
          throw new Error(`Conversion from ${fileExtension} to ${targetFormat} is not supported`);
        }
        break;
      }

      case 'compress': {
        const quality = options?.quality || 80;
        
        // Simple compression simulation (in reality would use proper compression libraries)
        const compressionRatio = quality / 100;
        const compressedSize = Math.floor(fileBuffer.length * compressionRatio);
        
        result = {
          originalSize: fileBuffer.length,
          compressedSize,
          compressionRatio: (1 - compressionRatio).toFixed(2),
          quality,
          message: 'Actual compression requires specialized libraries',
        };
        break;
      }

      default:
        throw new Error('Invalid operation');
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Log file processing
    try {
      await supabase.from('page_visits').insert({
        page_path: `/file-processing/${operation}`,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: 'file-processor',
        referrer: fileName,
      });
    } catch (logError) {
      console.error('Failed to log file processing:', logError);
    }

    return new Response(
      JSON.stringify({
        operation,
        fileName,
        processedAt: new Date().toISOString(),
        result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in file-processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to analyze JSON structure
function analyzeJSONStructure(obj: any, depth = 0): any {
  if (depth > 3) return '[nested]'; // Prevent infinite recursion
  
  if (Array.isArray(obj)) {
    return {
      type: 'array',
      length: obj.length,
      itemTypes: obj.length > 0 ? [typeof obj[0]] : [],
    };
  } else if (typeof obj === 'object' && obj !== null) {
    const structure: any = { type: 'object', keys: [] };
    for (const key in obj) {
      structure.keys.push({
        name: key,
        type: typeof obj[key],
        structure: typeof obj[key] === 'object' ? analyzeJSONStructure(obj[key], depth + 1) : null,
      });
    }
    return structure;
  } else {
    return { type: typeof obj };
  }
}

// Helper function to convert JSON to readable text
function convertJSONToText(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (Array.isArray(obj)) {
    let text = `${spaces}List with ${obj.length} items:\n`;
    obj.forEach((item, index) => {
      text += `${spaces}  ${index + 1}. ${convertJSONToText(item, indent + 2)}\n`;
    });
    return text;
  } else if (typeof obj === 'object' && obj !== null) {
    let text = `${spaces}Object:\n`;
    for (const [key, value] of Object.entries(obj)) {
      text += `${spaces}  ${key}: ${convertJSONToText(value, indent + 2)}\n`;
    }
    return text;
  } else {
    return String(obj);
  }
}
