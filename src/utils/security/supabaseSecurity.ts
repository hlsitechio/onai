/**
 * Supabase Security Configuration
 * 
 * This file provides security utilities and configurations specifically
 * for Supabase integrations in the OneAI application.
 */

import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '../logging/logger';
import { ErrorCode, ErrorSeverity, createError } from '../errorHandling';
import { xssProtection } from './securityConfig';

const logger = createLogger('SupabaseSecurity');

/**
 * Supabase Functions Security
 * - Secures interactions with Supabase Edge Functions
 * - Handles Gemini AI and other function calls
 */
export const supabaseFunctionsSecurity = {
  /**
   * Validates and sanitizes payloads for Supabase Edge Functions
   * @param functionName The name of the function being called
   * @param payload The payload to sanitize
   */
  sanitizeFunctionPayload(functionName: string, payload: any): any {
    if (!payload) return {};
    
    try {
      // Create a deep copy to avoid modifying original
      const sanitizedPayload = JSON.parse(JSON.stringify(payload));
      
      // Apply function-specific sanitization
      switch (functionName) {
        case 'gemini-ai':
          // For Gemini AI function, sanitize prompts and user inputs
          if (sanitizedPayload.prompt) {
            sanitizedPayload.prompt = xssProtection.sanitizeGeminiPrompt(sanitizedPayload.prompt);
          }
          if (sanitizedPayload.messages && Array.isArray(sanitizedPayload.messages)) {
            sanitizedPayload.messages = sanitizedPayload.messages.map(msg => {
              if (msg.content) {
                msg.content = xssProtection.sanitizeInput(msg.content);
              }
              return msg;
            });
          }
          break;
          
        case 'google-vision-ocr':
          // For OCR, typically we just need to ensure the image data is properly formatted
          // No need to sanitize binary data, but validate any text parameters
          if (sanitizedPayload.options) {
            sanitizedPayload.options = xssProtection.sanitizeInput(JSON.stringify(sanitizedPayload.options));
          }
          break;
          
        case 'track-visit':
          // For visitor tracking, sanitize any user-provided information
          if (sanitizedPayload.referrer) {
            sanitizedPayload.referrer = xssProtection.sanitizeInput(sanitizedPayload.referrer);
          }
          if (sanitizedPayload.userAgent) {
            sanitizedPayload.userAgent = xssProtection.sanitizeInput(sanitizedPayload.userAgent);
          }
          break;
          
        default:
          // Generic sanitization for other functions
          Object.keys(sanitizedPayload).forEach(key => {
            if (typeof sanitizedPayload[key] === 'string') {
              sanitizedPayload[key] = xssProtection.sanitizeInput(sanitizedPayload[key]);
            }
          });
      }
      
      return sanitizedPayload;
    } catch (error) {
      logger.error('Error sanitizing function payload', { error, functionName });
      throw createError(
        ErrorCode.SECURITY_ERROR,
        'Error preparing data for server function',
        ErrorSeverity.WARNING
      );
    }
  },
  
  /**
   * Securely invokes a Supabase Edge Function with sanitized payload
   */
  async invokeFunction<T = any>(functionName: string, payload: any): Promise<T> {
    try {
      // Sanitize the payload
      const sanitizedPayload = this.sanitizeFunctionPayload(functionName, payload);
      
      // Call the function with rate limiting check
      if (this.isRateLimited(functionName)) {
        throw createError(
          ErrorCode.RATE_LIMIT_EXCEEDED,
          'Too many requests to this function. Please try again later.',
          ErrorSeverity.WARNING
        );
      }
      
      // Invoke the function
      const { data, error } = await supabase.functions.invoke<T>(functionName, {
        body: sanitizedPayload
      });
      
      // Handle errors
      if (error) {
        logger.error('Supabase function error', { error, functionName });
        throw createError(
          ErrorCode.SUPABASE_FUNCTION_ERROR,
          `Error calling ${functionName}: ${error.message}`,
          ErrorSeverity.ERROR
        );
      }
      
      // Track the function call for rate limiting
      this.trackFunctionCall(functionName);
      
      return data as T;
    } catch (error) {
      // Re-throw our error objects, convert others
      if ((error as any).code && (error as any).severity) {
        throw error;
      }
      
      logger.error('Error invoking Supabase function', { error, functionName });
      throw createError(
        ErrorCode.SUPABASE_FUNCTION_ERROR,
        `Failed to invoke ${functionName}`,
        ErrorSeverity.ERROR
      );
    }
  },
  
  // Track function calls for rate limiting
  _functionCalls: new Map<string, { timestamps: number[], dailyTokens: number }>(),
  
  /**
   * Tracks a function call for rate limiting purposes
   */
  trackFunctionCall(functionName: string, tokenCount: number = 0): void {
    const now = Date.now();
    const record = this._functionCalls.get(functionName) || { timestamps: [], dailyTokens: 0 };
    
    // Add current timestamp
    record.timestamps.push(now);
    
    // Track token usage for the day
    if (tokenCount > 0) {
      record.dailyTokens += tokenCount;
    }
    
    // Clean up old timestamps (older than 1 hour)
    record.timestamps = record.timestamps.filter(time => (now - time) < 3600000);
    
    // Update the record
    this._functionCalls.set(functionName, record);
  },
  
  /**
   * Checks if a function is currently rate limited
   */
  isRateLimited(functionName: string): boolean {
    const record = this._functionCalls.get(functionName);
    if (!record) return false;
    
    const now = Date.now();
    
    // Count calls in the last minute
    const callsLastMinute = record.timestamps.filter(time => (now - time) < 60000).length;
    if (callsLastMinute >= 10) return true; // More than 10 calls per minute
    
    // Count calls in the last hour
    const callsLastHour = record.timestamps.length;
    if (callsLastHour >= 100) return true; // More than 100 calls per hour
    
    // Check daily token limit for AI functions
    if (functionName === 'gemini-ai' && record.dailyTokens >= 50000) return true;
    
    return false;
  }
};

/**
 * Supabase Storage Security
 * - Secures interactions with Supabase Storage
 * - Handles uploads and downloads securely
 */
export const supabaseStorageSecurity = {
  /**
   * Validates content before saving to Supabase
   */
  validateNoteContent(content: string): boolean {
    if (!content) return false;
    
    // Check note size (prevent large note uploads)
    if (content.length > 100000) { // 100KB limit
      logger.warn('Note content exceeds size limit');
      return false;
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
      /javascript:/i,
      /data:text\/html/i,
      /eval\s*\(/i
    ];
    
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(content));
    if (hasSuspiciousPattern) {
      logger.warn('Note content contains suspicious patterns');
      return false;
    }
    
    return true;
  },
  
  /**
   * Securely saves a note to Supabase with validation
   */
  async secureNoteSave(noteId: string, content: string): Promise<boolean> {
    try {
      // Validate content before saving
      if (!this.validateNoteContent(content)) {
        throw createError(
          ErrorCode.SECURITY_ERROR,
          'Note content failed security validation',
          ErrorSeverity.WARNING
        );
      }
      
      // Check note ID format (prevent path traversal)
      if (!/^[a-zA-Z0-9_-]+$/.test(noteId)) {
        throw createError(
          ErrorCode.SECURITY_ERROR,
          'Invalid note ID format',
          ErrorSeverity.WARNING
        );
      }
      
      // Use the existing saveNoteToSupabase function from your codebase
      // This is just a placeholder - you would use your actual function
      // const success = await saveNoteToSupabase(noteId, content);
      
      return true;
    } catch (error) {
      logger.error('Error in secure note save', { error, noteId });
      
      // Re-throw our error objects, convert others
      if ((error as any).code && (error as any).severity) {
        throw error;
      }
      
      throw createError(
        ErrorCode.STORAGE_ERROR,
        'Failed to securely save note',
        ErrorSeverity.ERROR
      );
    }
  }
};

/**
 * Supabase Realtime Security
 * - Secures Supabase Realtime channels and subscriptions
 */
export const supabaseRealtimeSecurity = {
  /**
   * Active channel subscriptions
   */
  activeChannels: new Set<string>(),
  
  /**
   * Maximum allowed concurrent channels
   */
  MAX_CONCURRENT_CHANNELS: 5,
  
  /**
   * Validates a channel name
   */
  validateChannelName(channelName: string): boolean {
    // Check for valid channel name format (prevent injection)
    return /^[a-zA-Z0-9_.-]+$/.test(channelName);
  },
  
  /**
   * Securely subscribes to a Supabase Realtime channel
   */
  secureSubscribe(channelName: string, eventName: string, callback: Function): any {
    try {
      // Validate channel name
      if (!this.validateChannelName(channelName)) {
        logger.error('Invalid channel name', { channelName });
        throw createError(
          ErrorCode.SECURITY_ERROR,
          'Invalid channel name format',
          ErrorSeverity.WARNING
        );
      }
      
      // Check if we've reached the maximum number of concurrent channels
      if (this.activeChannels.size >= this.MAX_CONCURRENT_CHANNELS) {
        logger.warn('Maximum concurrent channels reached');
        throw createError(
          ErrorCode.LIMIT_EXCEEDED,
          'Maximum number of active channels reached',
          ErrorSeverity.WARNING
        );
      }
      
      // Create and track the channel
      const channel = supabase.channel(channelName);
      this.activeChannels.add(channelName);
      
      // Set up cleanup on unsubscribe
      const originalUnsubscribe = channel.unsubscribe;
      channel.unsubscribe = () => {
        this.activeChannels.delete(channelName);
        return originalUnsubscribe.call(channel);
      };
      
      // Return the configured channel
      return channel.on(eventName, (payload) => {
        // Sanitize payload before passing to callback
        const sanitizedPayload = this.sanitizeRealtimePayload(payload);
        callback(sanitizedPayload);
      });
    } catch (error) {
      logger.error('Error in secure subscribe', { error, channelName });
      
      // Re-throw our error objects, convert others
      if ((error as any).code && (error as any).severity) {
        throw error;
      }
      
      throw createError(
        ErrorCode.REALTIME_ERROR,
        'Failed to subscribe to channel',
        ErrorSeverity.ERROR
      );
    }
  },
  
  /**
   * Sanitizes a Realtime payload
   */
  sanitizeRealtimePayload(payload: any): any {
    try {
      // Create a deep copy to avoid modifying original
      const sanitizedPayload = JSON.parse(JSON.stringify(payload));
      
      // Sanitize string values recursively
      const sanitizeObject = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'string') {
            obj[key] = xssProtection.sanitizeInput(obj[key]);
          } else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
          }
        });
      };
      
      sanitizeObject(sanitizedPayload);
      return sanitizedPayload;
    } catch (error) {
      logger.error('Error sanitizing Realtime payload', { error });
      return {}; // Return empty object on error
    }
  }
};

/**
 * Initialize Supabase security features
 */
export function initSupabaseSecurity(): void {
  logger.info('Initializing Supabase security configuration');
  
  // Set up global error handler for Supabase
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const response = await originalFetch(input, init);
      
      // Check for Supabase API errors
      if (response.url.includes('supabase.co') && !response.ok) {
        logger.error('Supabase API error', { 
          status: response.status, 
          url: response.url 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Fetch error', { error, url: String(input) });
      throw error;
    }
  };
}

export default {
  supabaseFunctionsSecurity,
  supabaseStorageSecurity,
  supabaseRealtimeSecurity,
  initSupabaseSecurity
};
