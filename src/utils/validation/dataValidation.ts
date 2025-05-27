/**
 * Data Validation Utilities for OneAI
 * 
 * Provides comprehensive validation functions to ensure data integrity
 * and prevent potential security issues without requiring external services.
 */

import { ErrorCode, ErrorSeverity, createError, logError } from '../errorHandling';

// Maximum allowed sizes for various content types
const MAX_SIZES = {
  NOTE_CONTENT: 1024 * 1024, // 1MB
  NOTE_TITLE: 200,           // 200 characters
  TAG: 50,                   // 50 characters
  MAX_TAGS: 20,              // Maximum number of tags per note
  SHARE_LINK_EXPIRY: 90,     // Maximum expiry in days
};

// Valid patterns for content validation
const PATTERNS = {
  ID: /^[a-zA-Z0-9_-]{1,64}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
};

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validates note content for size and potential security issues
 */
export const validateNoteContent = (content: string): ValidationResult => {
  const errors: string[] = [];
  
  // Check content size
  if (!content) {
    errors.push('Note content cannot be empty');
  } else if (content.length > MAX_SIZES.NOTE_CONTENT) {
    errors.push(`Note content exceeds maximum size of ${MAX_SIZES.NOTE_CONTENT / 1024}KB`);
  }
  
  // Check for potentially malicious content
  // This is a basic check - a real implementation would have more sophisticated detection
  const maliciousPatterns = [
    '<script>', 
    'javascript:',
    'onerror=',
    'onload=',
    'eval(',
    'document.cookie'
  ];
  
  for (const pattern of maliciousPatterns) {
    if (content.toLowerCase().includes(pattern)) {
      errors.push(`Note contains potentially unsafe content: ${pattern}`);
      
      // Log this as a security concern
      const error = createError(
        ErrorCode.INVALID_NOTE_FORMAT,
        `Note contains potentially unsafe content: ${pattern}`,
        ErrorSeverity.WARNING,
        { contentSnippet: content.substring(0, 100) }
      );
      logError(error, { notify: false }); // Don't notify user, just log
      break;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validates note title
 */
export const validateNoteTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  
  if (title && title.length > MAX_SIZES.NOTE_TITLE) {
    errors.push(`Title exceeds maximum length of ${MAX_SIZES.NOTE_TITLE} characters`);
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validates note ID format
 */
export const validateNoteId = (id: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!id) {
    errors.push('Note ID cannot be empty');
  } else if (!PATTERNS.ID.test(id)) {
    errors.push('Note ID contains invalid characters');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validates tags
 */
export const validateTags = (tags: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (tags.length > MAX_SIZES.MAX_TAGS) {
    errors.push(`Maximum number of tags (${MAX_SIZES.MAX_TAGS}) exceeded`);
  }
  
  for (const tag of tags) {
    if (tag.length > MAX_SIZES.TAG) {
      errors.push(`Tag "${tag}" exceeds maximum length of ${MAX_SIZES.TAG} characters`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validates share link expiration time
 */
export const validateShareLinkExpiry = (expiryDays: number): ValidationResult => {
  const errors: string[] = [];
  
  if (expiryDays <= 0) {
    errors.push('Expiry days must be greater than 0');
  } else if (expiryDays > MAX_SIZES.SHARE_LINK_EXPIRY) {
    errors.push(`Expiry days cannot exceed ${MAX_SIZES.SHARE_LINK_EXPIRY}`);
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validates an email address format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email cannot be empty');
  } else if (!PATTERNS.EMAIL.test(email)) {
    errors.push('Invalid email format');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validates a URL format
 */
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL cannot be empty');
  } else if (!PATTERNS.URL.test(url)) {
    errors.push('Invalid URL format');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Sanitizes a string for safe display (basic HTML entity encoding)
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Normalizes a string for storage (trims whitespace, normalizes line endings)
 */
export const normalizeString = (input: string): string => {
  return input
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
};

/**
 * Extracts a title from note content
 */
export const extractTitleFromContent = (content: string): string => {
  if (!content) return 'Untitled Note';
  
  // Try to extract from first heading
  const headingMatch = content.match(/^#+ (.+)$/m);
  if (headingMatch && headingMatch[1]) {
    return headingMatch[1].trim().substring(0, MAX_SIZES.NOTE_TITLE);
  }
  
  // Otherwise use first line
  const firstLine = content.split('\n')[0].trim();
  if (firstLine) {
    return firstLine.substring(0, MAX_SIZES.NOTE_TITLE);
  }
  
  return 'Untitled Note';
};

/**
 * Creates a summary/excerpt from note content
 */
export const createExcerptFromContent = (content: string, maxLength: number = 150): string => {
  if (!content) return '';
  
  // Remove markdown headings and formatting
  const plainText = content
    .replace(/^#+ /gm, '')   // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold
    .replace(/\*(.+?)\*/g, '$1')     // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Replace links with link text
    .replace(/!\[.+?\]\(.+?\)/g, '[Image]') // Replace images
    .replace(/```[\s\S]+?```/g, '[Code]')  // Replace code blocks
    .replace(/`(.+?)`/g, '$1')   // Remove inline code
    .replace(/\n/g, ' ')        // Replace newlines with spaces
    .replace(/\s+/g, ' ')       // Normalize spaces
    .trim();
  
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

/**
 * Performs validation of an entire note object
 */
export const validateNote = (
  id: string, 
  content: string, 
  title?: string, 
  tags: string[] = []
): ValidationResult => {
  const errors: string[] = [];
  
  // Validate ID
  const idValidation = validateNoteId(id);
  if (!idValidation.valid && idValidation.errors) {
    errors.push(...idValidation.errors);
  }
  
  // Validate content
  const contentValidation = validateNoteContent(content);
  if (!contentValidation.valid && contentValidation.errors) {
    errors.push(...contentValidation.errors);
  }
  
  // Validate title if provided
  if (title) {
    const titleValidation = validateNoteTitle(title);
    if (!titleValidation.valid && titleValidation.errors) {
      errors.push(...titleValidation.errors);
    }
  }
  
  // Validate tags
  if (tags.length > 0) {
    const tagsValidation = validateTags(tags);
    if (!tagsValidation.valid && tagsValidation.errors) {
      errors.push(...tagsValidation.errors);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};
