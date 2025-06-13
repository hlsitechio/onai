
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationRequest {
  data: any;
  schema: 'note' | 'user_profile' | 'custom';
  customSchema?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date';
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
    };
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: any;
  score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, schema, customSchema }: ValidationRequest = await req.json();

    console.log(`Validating data against schema: ${schema}`);

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedData: {},
      score: 100,
    };

    // Define validation schemas
    const schemas = {
      note: {
        title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
        content: { type: 'string', required: true, minLength: 1, maxLength: 50000 },
        is_encrypted: { type: 'boolean', required: false },
        tags: { type: 'string', required: false, maxLength: 500 },
      },
      user_profile: {
        name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
        email: { type: 'email', required: true },
        website: { type: 'url', required: false },
        bio: { type: 'string', required: false, maxLength: 1000 },
      },
      custom: customSchema || {},
    };

    const currentSchema = schemas[schema as keyof typeof schemas];
    if (!currentSchema) {
      throw new Error('Invalid schema type');
    }

    // Validate each field
    for (const [fieldName, rules] of Object.entries(currentSchema)) {
      const value = data[fieldName];
      let sanitizedValue = value;

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        result.errors.push(`Field '${fieldName}' is required`);
        result.isValid = false;
        result.score -= 20;
        continue;
      }

      // Skip validation for optional empty fields
      if (!rules.required && (value === undefined || value === null || value === '')) {
        result.sanitizedData[fieldName] = value;
        continue;
      }

      // Type validation
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            result.errors.push(`Field '${fieldName}' must be a string`);
            result.isValid = false;
            result.score -= 15;
          } else {
            sanitizedValue = value.trim();
          }
          break;

        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            result.errors.push(`Field '${fieldName}' must be a valid number`);
            result.isValid = false;
            result.score -= 15;
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            result.errors.push(`Field '${fieldName}' must be a boolean`);
            result.isValid = false;
            result.score -= 15;
          }
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value !== 'string' || !emailRegex.test(value)) {
            result.errors.push(`Field '${fieldName}' must be a valid email address`);
            result.isValid = false;
            result.score -= 20;
          } else {
            sanitizedValue = value.toLowerCase().trim();
          }
          break;

        case 'url':
          try {
            new URL(value);
            sanitizedValue = value.trim();
          } catch {
            result.errors.push(`Field '${fieldName}' must be a valid URL`);
            result.isValid = false;
            result.score -= 15;
          }
          break;

        case 'date':
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            result.errors.push(`Field '${fieldName}' must be a valid date`);
            result.isValid = false;
            result.score -= 15;
          } else {
            sanitizedValue = date.toISOString();
          }
          break;
      }

      // Length validation
      if (typeof sanitizedValue === 'string') {
        if (rules.minLength && sanitizedValue.length < rules.minLength) {
          result.errors.push(`Field '${fieldName}' must be at least ${rules.minLength} characters long`);
          result.isValid = false;
          result.score -= 10;
        }
        if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
          result.errors.push(`Field '${fieldName}' must be no more than ${rules.maxLength} characters long`);
          result.isValid = false;
          result.score -= 10;
        }
      }

      // Pattern validation
      if (rules.pattern && typeof sanitizedValue === 'string') {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(sanitizedValue)) {
          result.errors.push(`Field '${fieldName}' does not match the required pattern`);
          result.isValid = false;
          result.score -= 15;
        }
      }

      result.sanitizedData[fieldName] = sanitizedValue;
    }

    // Ensure score doesn't go below 0
    result.score = Math.max(0, result.score);

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Log validation attempt (optional)
    try {
      await supabase.from('page_visits').insert({
        page_path: `/validation/${schema}`,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: 'validation-service',
      });
    } catch (logError) {
      console.error('Failed to log validation:', logError);
    }

    return new Response(
      JSON.stringify({
        ...result,
        validatedAt: new Date().toISOString(),
        schema,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in data-validator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
