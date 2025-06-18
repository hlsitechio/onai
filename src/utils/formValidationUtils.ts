
/**
 * Form validation utilities to ensure accessibility and proper form attributes
 * Addresses missing id/name attributes and improves form accessibility
 */

export interface FormFieldValidation {
  hasId: boolean;
  hasName: boolean;
  hasLabel: boolean;
  hasAriaLabel: boolean;
  isAccessible: boolean;
}

/**
 * Validates form field accessibility and attributes
 */
export const validateFormField = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): FormFieldValidation => {
  const hasId = !!element.id;
  const hasName = !!element.name;
  const hasLabel = !!document.querySelector(`label[for="${element.id}"]`);
  const hasAriaLabel = !!element.getAttribute('aria-label') || !!element.getAttribute('aria-labelledby');
  
  return {
    hasId,
    hasName,
    hasLabel,
    hasAriaLabel,
    isAccessible: hasId && hasName && (hasLabel || hasAriaLabel)
  };
};

/**
 * Automatically fixes form fields missing essential attributes
 */
export const autoFixFormFields = () => {
  const formFields = document.querySelectorAll('input, textarea, select');
  const fixes: string[] = [];
  
  formFields.forEach((field, index) => {
    const element = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    // Skip if it's not a form input (like hidden fields)
    if (element.type === 'hidden' || element.type === 'submit' || element.type === 'button') {
      return;
    }
    
    // Add ID if missing
    if (!element.id) {
      const fieldName = element.name || element.type || 'field';
      element.id = `auto-${fieldName}-${index}`;
      fixes.push(`Added ID: ${element.id}`);
    }
    
    // Add name if missing
    if (!element.name) {
      element.name = element.id || `field-${index}`;
      fixes.push(`Added name: ${element.name}`);
    }
    
    // Add aria-label if no label is associated
    const validation = validateFormField(element);
    if (!validation.hasLabel && !validation.hasAriaLabel) {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) {
        element.setAttribute('aria-label', placeholder);
        fixes.push(`Added aria-label: ${placeholder}`);
      } else {
        element.setAttribute('aria-label', `${element.type} field`);
        fixes.push(`Added generic aria-label for ${element.type}`);
      }
    }
  });
  
  if (fixes.length > 0) {
    console.log('Form field fixes applied:', fixes);
  }
  
  return fixes;
};

/**
 * Validates all forms on the page and returns accessibility report
 */
export const validatePageForms = (): { valid: number; invalid: number; issues: string[] } => {
  const formFields = document.querySelectorAll('input, textarea, select');
  let valid = 0;
  let invalid = 0;
  const issues: string[] = [];
  
  formFields.forEach((field, index) => {
    const element = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    // Skip non-form inputs
    if (element.type === 'hidden' || element.type === 'submit' || element.type === 'button') {
      return;
    }
    
    const validation = validateFormField(element);
    
    if (validation.isAccessible) {
      valid++;
    } else {
      invalid++;
      const fieldIdentifier = element.id || element.name || `field-${index}`;
      
      if (!validation.hasId) {
        issues.push(`${fieldIdentifier}: Missing ID attribute`);
      }
      if (!validation.hasName) {
        issues.push(`${fieldIdentifier}: Missing name attribute`);
      }
      if (!validation.hasLabel && !validation.hasAriaLabel) {
        issues.push(`${fieldIdentifier}: Missing label or aria-label`);
      }
    }
  });
  
  return { valid, invalid, issues };
};

/**
 * Initialize form validation on page load
 */
export const initializeFormValidation = () => {
  // Run validation after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const report = validatePageForms();
        if (report.invalid > 0) {
          console.warn(`Form validation found ${report.invalid} accessibility issues:`, report.issues);
          console.log('Attempting auto-fix...');
          autoFixFormFields();
        } else {
          console.log(`Form validation passed: ${report.valid} accessible form fields found`);
        }
      }, 100); // Small delay to ensure all React components are rendered
    });
  } else {
    setTimeout(() => {
      const report = validatePageForms();
      if (report.invalid > 0) {
        console.warn(`Form validation found ${report.invalid} accessibility issues:`, report.issues);
        autoFixFormFields();
      }
    }, 100);
  }
};
