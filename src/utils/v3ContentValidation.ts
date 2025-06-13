
import type { Editor } from '@tiptap/react';
import type { Node } from '@tiptap/pm/model';

export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
  recommendations: string[];
}

export interface ValidationRule {
  name: string;
  validate: (content: string, node?: Node) => boolean;
  errorMessage: string;
  severity: 'error' | 'warning';
}

export const V3_VALIDATION_RULES: ValidationRule[] = [
  {
    name: 'validHTML',
    validate: (content: string) => {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        return true;
      } catch {
        return false;
      }
    },
    errorMessage: 'Content contains invalid HTML structure',
    severity: 'error'
  },
  
  {
    name: 'noScriptTags',
    validate: (content: string) => !content.includes('<script'),
    errorMessage: 'Script tags are not allowed for security reasons',
    severity: 'error'
  },
  
  {
    name: 'validAttributes',
    validate: (content: string) => {
      const allowedAttrs = ['class', 'id', 'href', 'src', 'alt', 'title', 'target', 'rel'];
      const attrRegex = /(\w+)=/g;
      const matches = content.match(attrRegex);
      
      if (!matches) return true;
      
      return matches.every(match => {
        const attr = match.replace('=', '');
        return allowedAttrs.includes(attr);
      });
    },
    errorMessage: 'Content contains disallowed attributes',
    severity: 'warning'
  },
  
  {
    name: 'properNesting',
    validate: (content: string) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
        return !doc.querySelector('parsererror');
      } catch {
        return false;
      }
    },
    errorMessage: 'Content has improper HTML nesting',
    severity: 'error'
  },
  
  {
    name: 'accessibleImages',
    validate: (content: string) => {
      const imgRegex = /<img[^>]*>/g;
      const images = content.match(imgRegex);
      
      if (!images) return true;
      
      return images.every(img => img.includes('alt='));
    },
    errorMessage: 'Images should have alt attributes for accessibility',
    severity: 'warning'
  },
  
  {
    name: 'validLinks',
    validate: (content: string) => {
      const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>/g;
      const links = [...content.matchAll(linkRegex)];
      
      return links.every(link => {
        const href = link[1];
        return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#');
      });
    },
    errorMessage: 'Links should have valid href attributes',
    severity: 'warning'
  }
];

export const validateV3Content = (content: string): ContentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  if (!content || content.trim() === '') {
    return {
      isValid: true,
      errors,
      warnings,
      score: 1,
      recommendations: ['Content is empty but valid']
    };
  }
  
  V3_VALIDATION_RULES.forEach(rule => {
    try {
      if (!rule.validate(content)) {
        if (rule.severity === 'error') {
          errors.push(rule.errorMessage);
        } else {
          warnings.push(rule.errorMessage);
        }
      }
    } catch (error) {
      console.warn(`Validation rule ${rule.name} failed:`, error);
      warnings.push(`Validation rule ${rule.name} encountered an error`);
    }
  });
  
  // Calculate score based on validation results
  const totalRules = V3_VALIDATION_RULES.length;
  const passedRules = totalRules - errors.length - warnings.length;
  const score = passedRules / totalRules;
  
  // Generate recommendations
  if (score < 1) {
    recommendations.push('Fix validation errors and warnings for optimal V3 compatibility');
  }
  
  if (warnings.length > 0) {
    recommendations.push('Address warnings to improve accessibility and best practices');
  }
  
  if (score === 1) {
    recommendations.push('Content is fully V3-compatible!');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score,
    recommendations
  };
};

export const sanitizeContentForV3 = (content: string): string => {
  try {
    // Create a temporary DOM element to safely parse content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Remove script tags
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove dangerous attributes
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover'];
    const allElements = tempDiv.querySelectorAll('*');
    
    allElements.forEach(element => {
      dangerousAttrs.forEach(attr => {
        if (element.hasAttribute(attr)) {
          element.removeAttribute(attr);
        }
      });
    });
    
    // Ensure images have alt attributes
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', 'Image');
      }
    });
    
    // Ensure links have proper attributes
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      if (link.hasAttribute('href')) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('http')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
    
    return tempDiv.innerHTML;
  } catch (error) {
    console.warn('Content sanitization failed:', error);
    return content; // Return original content if sanitization fails
  }
};

export const createContentValidator = (editor: Editor) => {
  return {
    validateCurrent: (): ContentValidationResult => {
      const content = editor.getHTML();
      return validateV3Content(content);
    },
    
    validateAndSanitize: (): string => {
      const content = editor.getHTML();
      return sanitizeContentForV3(content);
    },
    
    isV3Ready: (): boolean => {
      const result = validateV3Content(editor.getHTML());
      return result.isValid && result.score >= 0.8;
    },
    
    getValidationReport: () => {
      const content = editor.getHTML();
      const result = validateV3Content(content);
      
      return {
        ...result,
        contentLength: content.length,
        wordCount: content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length,
        timestamp: new Date().toISOString()
      };
    }
  };
};
