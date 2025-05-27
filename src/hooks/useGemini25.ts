import { useState, useCallback } from 'react';
import { 
  gemini25Service, 
  Gemini25Response, 
  RequestMode, 
  Gemini25Config 
} from '@/services/gemini25FlashService';

interface UseGemini25Options {
  onSuccess?: (response: Gemini25Response) => void;
  onError?: (error: string) => void;
  defaultConfig?: Partial<Gemini25Config>;
}

/**
 * React hook for easy integration of Gemini 2.5 Flash capabilities
 * Provides state management and convenient access to all Gemini features
 */
export function useGemini25(options: UseGemini25Options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<Gemini25Response | null>(null);
  const [thinking, setThinking] = useState<string | null>(null);

  // General purpose generate function
  const generate = useCallback(async (
    prompt: string,
    requestMode: RequestMode = 'standard',
    inputs: {
      textContent?: string;
      imageUrls?: string[];
      audioUrl?: string;
      videoUrl?: string;
    } = {},
    config: Partial<Gemini25Config> = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      setThinking(null);
      
      const mergedConfig = { ...options.defaultConfig, ...config };
      const result = await gemini25Service.generate(prompt, requestMode, inputs, mergedConfig);
      
      if (result.error) {
        setError(result.error);
        options.onError?.(result.error);
        return null;
      }
      
      if (result.thinking) {
        setThinking(result.thinking);
      }
      
      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Specialized functions for different capabilities
  const analyzeWithThinking = useCallback(async (content: string, question?: string) => {
    return generate(
      question || "Analyze this content with detailed thinking steps",
      'thinking',
      { textContent: content },
      { showThinking: true, temperature: 0.2 }
    );
  }, [generate]);

  const extractStructuredData = useCallback(async (content: string, dataFormat: string) => {
    return generate(
      `Extract the following from this content as JSON: ${dataFormat}`,
      'structured',
      { textContent: content },
      { returnStructured: true, temperature: 0.1 }
    );
  }, [generate]);

  const generateImage = useCallback(async (description: string, style?: string) => {
    const stylePrompt = style ? `Style: ${style}.` : '';
    return generate(
      `Generate an image based on this description: ${description}. ${stylePrompt}`,
      'text_to_image'
    );
  }, [generate]);

  const analyzeImages = useCallback(async (imageUrls: string[], question?: string) => {
    return generate(
      question || "Analyze these images and provide detailed insights",
      'multi_modal',
      { imageUrls }
    );
  }, [generate]);

  const processLongDocument = useCallback(async (document: string, task: string) => {
    return generate(
      `${task} for the following document while maintaining context throughout.`,
      'long_context',
      { textContent: document },
      { maxOutputTokens: 4096 }
    );
  }, [generate]);

  // Reset state
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResponse(null);
    setThinking(null);
  }, []);

  return {
    loading,
    error,
    response,
    thinking,
    generate,
    analyzeWithThinking,
    extractStructuredData,
    generateImage,
    analyzeImages,
    processLongDocument,
    reset
  };
}
