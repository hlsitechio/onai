/**
 * Gemini AI Security Configuration
 * 
 * This file provides security utilities specifically for integrating
 * with Gemini 2.5 AI in the OneAI application.
 */

// Import types and utilities
import { ErrorCode, ErrorSeverity, createError } from '../errorHandling';
import { xssProtection } from './securityConfig';

// Define Logger interface locally to avoid import issues
interface Logger {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
}

// Create logger instance
const logger: Logger = {
  debug: (message: string, data?: Record<string, unknown>) => console.debug(`[GeminiSecurity] ${message}`, data),
  info: (message: string, data?: Record<string, unknown>) => console.info(`[GeminiSecurity] ${message}`, data),
  warn: (message: string, data?: Record<string, unknown>) => console.warn(`[GeminiSecurity] ${message}`, data),
  error: (message: string, data?: Record<string, unknown>) => console.error(`[GeminiSecurity] ${message}`, data)
};

/**
 * Message part interface for Gemini API
 */
interface MessagePart {
  text?: string;
  [key: string]: unknown;
}

/**
 * Gemini API message interface
 */
interface GeminiMessage {
  content?: string;
  parts?: Array<string | MessagePart>;
  [key: string]: unknown;
}

/**
 * Gemini model configuration interface
 */
interface ModelConfig {
  temperature?: number;
  maxOutputTokens?: number;
  [key: string]: unknown;
}

/**
 * Gemini AI Security
 * - Protects against prompt injection and other AI security risks
 * - Implements rate limiting and validation for Gemini API
 */
export const geminiSecurity = {
  // Track API usage for rate limiting
  _apiCalls: {
    timestamps: [] as number[],
    dailyTokenCount: 0,
    lastReset: Date.now()
  },
  
  // Constants for rate limiting
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_REQUESTS_PER_HOUR: 50,
  MAX_TOKENS_PER_DAY: 50000,
  
  /**
   * Sanitizes a prompt to prevent prompt injection attacks
   */
  sanitizePrompt(prompt: string): string {
    if (!prompt) return '';
    
    // Remove potential system prompt injection patterns
    return prompt
      .replace(/system:/gi, '[s]')
      .replace(/assistant:/gi, '[a]')
      .replace(/user:/gi, '[u]')
      .replace(/ignore previous instructions/gi, '[filtered content]')
      .replace(/ignore your training/gi, '[filtered content]')
      .replace(/\[\[prompt\]\]/gi, '[filtered content]')
      .replace(/you must provide|you have to provide/gi, 'you may consider providing')
      .replace(/\{\{.+?\}\}/g, '[template content]'); // Remove handlebar templates
  },
  
  /**
   * Validates an AI model configuration
   */
  validateModelConfig(config: ModelConfig): boolean {
    if (!config) return false;
    
    // Check for unsafe temperature settings
    if (config.temperature !== undefined && (config.temperature > 1.0 || config.temperature < 0)) {
      return false;
    }
    
    // Check for excessively high max output tokens
    if (config.maxOutputTokens !== undefined && config.maxOutputTokens > 8192) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Check if we're currently rate limited
   */
  isRateLimited(): boolean {
    const now = Date.now();
    
    // Reset token count daily
    if (now - this._apiCalls.lastReset > 86400000) { // 24 hours
      this._apiCalls.dailyTokenCount = 0;
      this._apiCalls.lastReset = now;
    }
    
    // Clean up old timestamps
    this._apiCalls.timestamps = this._apiCalls.timestamps.filter(time => (now - time) < 3600000);
    
    // Check rate limits
    const callsLastMinute = this._apiCalls.timestamps.filter(time => (now - time) < 60000).length;
    if (callsLastMinute >= this.MAX_REQUESTS_PER_MINUTE) return true;
    
    const callsLastHour = this._apiCalls.timestamps.length;
    if (callsLastHour >= this.MAX_REQUESTS_PER_HOUR) return true;
    
    if (this._apiCalls.dailyTokenCount >= this.MAX_TOKENS_PER_DAY) return true;
    
    return false;
  },
  
  /**
   * Track an API call for rate limiting
   */
  trackApiCall(tokenCount = 0): void {
    const now = Date.now();
    this._apiCalls.timestamps.push(now);
    
    if (tokenCount > 0) {
      this._apiCalls.dailyTokenCount += tokenCount;
    }
  },
  
  /**
   * Safely process a Gemini message
   */
  processMessage(message: unknown): GeminiMessage | null {
    if (!message || typeof message !== 'object') return null;
    
    // Create a safe copy
    const safeMessage: GeminiMessage = { ...(message as GeminiMessage) };
    
    // Process content field
    if (typeof safeMessage.content === 'string') {
      safeMessage.content = this.sanitizePrompt(safeMessage.content);
    }
    
    // If it's a multipart message, sanitize each part
    if (safeMessage.parts && Array.isArray(safeMessage.parts)) {
      safeMessage.parts = safeMessage.parts.map(part => {
        if (typeof part === 'string') {
          return this.sanitizePrompt(part);
        } else if (part && typeof part === 'object') {
          // Handle multimodal content
          const partObj = part as MessagePart;
          if (typeof partObj.text === 'string') {
            partObj.text = this.sanitizePrompt(partObj.text);
          }
          // Don't modify image data
          return partObj;
        }
        return part;
      });
    }
    
    return safeMessage;
  },
  
  /**
   * Validate AI response to detect harmful content
   */
  validateResponse(response: unknown): boolean {
    if (!response) return false;
    
    // Look for response content
    let content = '';
    
    if (typeof response === 'string') {
      content = response;
    } else if (typeof response === 'object' && response !== null) {
      const responseObj = response as Record<string, unknown>;
      if (typeof responseObj.text === 'string') {
        content = responseObj.text;
      } else if (typeof responseObj.content === 'string') {
        content = responseObj.content;
      } else if (Array.isArray(responseObj.parts)) {
        // Extract text from parts
        content = responseObj.parts
          .filter((part: unknown) => 
            typeof part === 'string' || 
            (typeof part === 'object' && part !== null && 
              typeof (part as Record<string, unknown>).text === 'string')
          )
          .map((part: unknown) => 
            typeof part === 'string' ? 
              part : 
              (part as Record<string, unknown>).text as string
          )
          .join(' ');
      }
    }
    
    if (!content) return true; // No content to validate
    
    // Check for potentially harmful content
    const harmfulPatterns = [
      /how to (make|create|build) (bomb|explosive|weapon)/i,
      /(hack|compromise|infiltrate) (system|server|computer|account)/i,
      /(steal|swipe) (credit card|password|identity)/i,
      /(exploit|vulnerability) (in|of) (system|software|platform)/i
    ];
    
    return !harmfulPatterns.some(pattern => pattern.test(content));
  },
  
  /**
   * Safe AI content generation with rate limiting and validation
   */
  async generateSafeContent(prompt: string, options: ModelConfig = {}): Promise<string> {
    try {
      // Check rate limits
      if (this.isRateLimited()) {
        throw createError(
          ErrorCode.RATE_LIMIT_EXCEEDED,
          'AI requests rate limit exceeded. Please try again later.',
          ErrorSeverity.WARNING
        );
      }
      
      // Sanitize the prompt
      const safePrompt = this.sanitizePrompt(prompt);
      
      // Validate the options
      if (!this.validateModelConfig(options)) {
        throw createError(
          ErrorCode.INVALID_PARAMETERS,
          'Invalid AI model configuration',
          ErrorSeverity.ERROR
        );
      }
      
      // Track this API call
      this.trackApiCall();
      
      // In a real implementation, you would call your Gemini API here
      // This is a placeholder - you would integrate with your actual Gemini implementation
      // const response = await yourGeminiImplementation.generateContent(safePrompt, options);
      
      // For this example, we'll just return a placeholder response
      const placeholderResponse = `Safe AI response for: ${safePrompt.substring(0, 30)}...`;
      
      // Validate the response
      if (!this.validateResponse(placeholderResponse)) {
        throw createError(
          ErrorCode.CONTENT_POLICY_VIOLATION,
          'The AI response contained potentially harmful content',
          ErrorSeverity.ERROR
        );
      }
      
      // Track token usage (in a real implementation, you would get this from the API response)
      this.trackApiCall(100); // Placeholder token count
      
      return placeholderResponse;
    } catch (error) {
      logger.error('Error in safe content generation', { error });
      
      // Re-throw our error objects, convert others
      if (error instanceof Error && 
          'code' in error && 
          'severity' in error) {
        throw error;
      }
      
      throw createError(
        ErrorCode.AI_ERROR,
        'Failed to generate AI content safely',
        ErrorSeverity.ERROR
      );
    }
  },
  
  /**
   * Sanitize text for display after AI generation
   */
  sanitizeAiOutput(text: string): string {
    return xssProtection.sanitizeForDisplay(text);
  }
};

/**
 * Initialize Gemini security features
 */
export function initGeminiSecurity(): void {
  logger.info('Initializing Gemini security configuration');
}

export default {
  geminiSecurity,
  initGeminiSecurity
};
