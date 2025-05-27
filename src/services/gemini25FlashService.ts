// Advanced Gemini 2.5 Flash Integration Service
import { supabase } from "@/integrations/supabase/client";

// Response type for Gemini 2.5 Flash responses
export interface Gemini25Response {
  result?: string;
  thinking?: string;
  structuredData?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Request types for different Gemini 2.5 Flash capabilities
export type RequestMode = 
  | 'thinking'           // Show step-by-step reasoning
  | 'structured'         // Return JSON structured data
  | 'multi_modal'        // Process text, images, audio
  | 'text_to_image'      // Generate images from text
  | 'long_context'       // Process very long documents
  | 'audio_to_text'      // Transcribe audio to text
  | 'video_analysis'     // Extract insights from videos
  | 'standard';          // Standard text generation

// Configuration for Gemini 2.5 Flash requests
export interface Gemini25Config {
  temperature?: number;  // 0-1, higher = more creative
  topK?: number;         // Limits token selection to top K options
  topP?: number;         // Nucleus sampling threshold
  maxOutputTokens?: number;
  stopSequences?: string[];
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
  showThinking?: boolean; // Whether to return thinking steps
  returnStructured?: boolean; // Whether to return structured data
}

/**
 * Enhanced Gemini 2.5 Flash service with next-generation AI capabilities
 * Supports multimodal inputs, thinking mode, structured outputs, and more
 */
export class Gemini25FlashService {
  // Default configuration
  private defaultConfig: Gemini25Config = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
    showThinking: false,
    returnStructured: false
  };

  /**
   * Generate content with Gemini 2.5 Flash
   * @param prompt The main prompt text
   * @param requestMode The type of request
   * @param inputs Additional multimodal inputs (images, audio, etc.)
   * @param config Configuration options
   */
  async generate(
    prompt: string,
    requestMode: RequestMode = 'standard',
    inputs: {
      textContent?: string;
      imageUrls?: string[];
      audioUrl?: string;
      videoUrl?: string;
    } = {},
    config: Partial<Gemini25Config> = {}
  ): Promise<Gemini25Response> {
    try {
      const fullConfig = { ...this.defaultConfig, ...config };
      
      // Build request payload for Supabase Edge Function
      const payload = {
        prompt,
        requestMode,
        ...inputs,
        config: fullConfig,
        model: 'gemini-2.5-flash'
      };

      console.log('Calling Gemini 2.5 Flash with:', {
        requestMode,
        promptPreview: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        hasMultimodal: !!(inputs.imageUrls?.length || inputs.audioUrl || inputs.videoUrl)
      });

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: payload
      });

      if (error) {
        console.error('Error calling Gemini 2.5 Flash service:', error);
        return {
          error: `Failed to process with Gemini 2.5 Flash: ${error.message || 'Unknown error'}`
        };
      }

      if (!data) {
        return {
          error: 'No response received from Gemini 2.5 Flash service'
        };
      }

      return data as Gemini25Response;
    } catch (error) {
      console.error('Error in Gemini 2.5 Flash service:', error);
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Process note content with step-by-step thinking
   * Shows the model's reasoning process
   */
  async thinkingAnalysis(content: string, specificQuestion?: string): Promise<Gemini25Response> {
    const prompt = specificQuestion || 
      "Analyze this note content carefully using step-by-step thinking. " +
      "Identify key themes, insights, and suggestions for improvement. " +
      "Be thorough in your analysis and show your reasoning process.";
    
    return this.generate(prompt, 'thinking', { textContent: content }, { 
      showThinking: true,
      temperature: 0.2 // Lower temperature for more precise analysis
    });
  }

  /**
   * Generate structured data from note content
   * Returns well-formatted JSON for programmatic use
   */
  async extractStructuredData(content: string, dataFormat: string): Promise<Gemini25Response> {
    const prompt = `Extract the following information from this content as structured JSON: ${dataFormat}. ` +
      "Ensure the output is valid JSON format with proper nesting and data types.";
    
    return this.generate(prompt, 'structured', { textContent: content }, { 
      returnStructured: true,
      temperature: 0.1 // Very low temperature for consistent structured output
    });
  }

  /**
   * Generate images based on text description
   */
  async generateImage(description: string, style?: string): Promise<Gemini25Response> {
    const stylePrompt = style ? `Style: ${style}. ` : '';
    const prompt = `Generate an image based on this description: ${description}. ${stylePrompt}` +
      "Ensure the image matches the description accurately.";
    
    return this.generate(prompt, 'text_to_image');
  }

  /**
   * Analyze images and provide insights
   */
  async analyzeImages(imageUrls: string[], question?: string): Promise<Gemini25Response> {
    const prompt = question || 
      "Analyze these images and provide detailed insights. " +
      "Describe what you see, identify key elements, and explain their significance.";
    
    return this.generate(prompt, 'multi_modal', { imageUrls });
  }

  /**
   * Process long documents with context retention
   */
  async processLongDocument(document: string, task: string): Promise<Gemini25Response> {
    const prompt = `${task} for the following document while maintaining context throughout.`;
    
    return this.generate(prompt, 'long_context', { textContent: document }, {
      maxOutputTokens: 4096 // Higher token limit for long documents
    });
  }
}

// Export singleton instance
export const gemini25Service = new Gemini25FlashService();
