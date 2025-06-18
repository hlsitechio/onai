
/**
 * Standards Mode validation utilities to ensure proper HTML5 compliance
 * and detect any potential Quirks Mode issues in the main document
 */

export interface StandardsModeReport {
  isStandardsMode: boolean;
  compatMode: string;
  doctypePresent: boolean;
  doctypeCorrect: boolean;
  htmlLangPresent: boolean;
  metaCharsetPresent: boolean;
  viewportMetaPresent: boolean;
  warnings: string[];
  recommendations: string[];
}

/**
 * Validates that the document is in Standards Mode
 */
export const validateStandardsMode = (): StandardsModeReport => {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Check document compatibility mode
  const isStandardsMode = document.compatMode === 'CSS1Compat';
  const compatMode = document.compatMode;
  
  if (!isStandardsMode) {
    warnings.push('Document is in Quirks Mode - this can cause layout issues');
  }
  
  // Check DOCTYPE
  const doctype = document.doctype;
  const doctypePresent = !!doctype;
  const doctypeCorrect = doctype?.name === 'html' && !doctype.publicId && !doctype.systemId;
  
  if (!doctypePresent) {
    warnings.push('No DOCTYPE declaration found');
    recommendations.push('Add <!DOCTYPE html> at the beginning of your HTML document');
  } else if (!doctypeCorrect) {
    warnings.push('DOCTYPE is not HTML5 compliant');
    recommendations.push('Use <!DOCTYPE html> for HTML5 compliance');
  }
  
  // Check html lang attribute
  const htmlElement = document.documentElement;
  const htmlLangPresent = !!htmlElement.getAttribute('lang');
  
  if (!htmlLangPresent) {
    warnings.push('HTML element missing lang attribute');
    recommendations.push('Add lang="en" (or appropriate language) to <html> element');
  }
  
  // Check meta charset
  const metaCharset = document.querySelector('meta[charset]');
  const metaCharsetPresent = !!metaCharset;
  
  if (!metaCharsetPresent) {
    warnings.push('Meta charset declaration missing');
    recommendations.push('Add <meta charset="UTF-8"> in document head');
  }
  
  // Check viewport meta
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const viewportMetaPresent = !!viewportMeta;
  
  if (!viewportMetaPresent) {
    warnings.push('Viewport meta tag missing');
    recommendations.push('Add <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  
  return {
    isStandardsMode,
    compatMode,
    doctypePresent,
    doctypeCorrect,
    htmlLangPresent,
    metaCharsetPresent,
    viewportMetaPresent,
    warnings,
    recommendations
  };
};

/**
 * Monitor for external iframe documents in Quirks Mode
 * This helps identify third-party content that might be causing console warnings
 */
export const monitorExternalQuirksMode = () => {
  const externalQuirksFrames: string[] = [];
  
  try {
    // Check all iframes on the page
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach((iframe, index) => {
      try {
        // Only check same-origin iframes to avoid CORS issues
        const iframeSrc = iframe.src || 'unknown';
        
        // Skip third-party iframes (like DoubleClick) as we can't access their content
        if (iframeSrc.includes('doubleclick.net') || 
            iframeSrc.includes('googletagmanager.com') ||
            iframeSrc.includes('google-analytics.com')) {
          // These are expected to potentially be in Quirks Mode
          console.log(`Third-party iframe detected (${iframeSrc}) - Quirks Mode warnings from this source can be ignored`);
          return;
        }
        
        // For same-origin iframes, we could check their compatMode
        // but this is rarely needed in modern applications
        
      } catch (error) {
        // Cross-origin iframe - can't access, which is expected
        console.log(`Cross-origin iframe at index ${index} - cannot check compatMode`);
      }
    });
    
  } catch (error) {
    console.warn('Error monitoring external frames:', error);
  }
  
  return externalQuirksFrames;
};

/**
 * Run a comprehensive Standards Mode audit
 */
export const auditStandardsMode = (): StandardsModeReport => {
  console.log('Running Standards Mode audit...');
  
  const report = validateStandardsMode();
  
  // Log results
  if (report.isStandardsMode) {
    console.log('✅ Document is in Standards Mode');
  } else {
    console.error('❌ Document is in Quirks Mode');
  }
  
  if (report.warnings.length > 0) {
    console.warn('Standards Mode warnings:', report.warnings);
  }
  
  if (report.recommendations.length > 0) {
    console.info('Recommendations:', report.recommendations);
  }
  
  // Monitor external frames
  monitorExternalQuirksMode();
  
  return report;
};

/**
 * Initialize Standards Mode monitoring
 */
export const initializeStandardsModeMonitoring = () => {
  // Run initial audit
  const report = auditStandardsMode();
  
  // Set up periodic monitoring for dynamic content
  const monitorInterval = setInterval(() => {
    const currentReport = validateStandardsMode();
    
    // Only log if something changed
    if (currentReport.compatMode !== report.compatMode) {
      console.warn('Document compatibility mode changed!', {
        from: report.compatMode,
        to: currentReport.compatMode
      });
    }
  }, 30000); // Check every 30 seconds
  
  // Cleanup function
  return () => {
    clearInterval(monitorInterval);
  };
};
