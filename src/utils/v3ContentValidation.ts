
// V3 Content validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateV3Content = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic HTML validation
  if (!content || content.trim() === '') {
    warnings.push('Content is empty');
  }
  
  // Check for potential security issues
  if (content.includes('<script>')) {
    errors.push('Script tags detected - security risk');
  }
  
  // Check for accessibility issues
  if (content.includes('<img') && !content.includes('alt=')) {
    warnings.push('Images without alt text - accessibility concern');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
