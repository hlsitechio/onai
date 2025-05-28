/**
 * OneAI Security System
 * 
 * This file serves as the entry point for the comprehensive security system
 * of the OneAI application. It initializes and configures all security components
 * and provides a unified interface for security features.
 */

import { createLogger } from '../logging/logger';
import baseSecurityConfig, { initSecurity as initBaseSecurityConfig } from './securityConfig';
import supabaseSecurity, { initSupabaseSecurity } from './supabaseSecurity';
import geminiSecurity, { initGeminiSecurity } from './geminiSecurity';
import uiSecurity, { initUISecurity } from './uiSecurity';

// Create a dedicated logger for the security system
const logger = createLogger('SecuritySystem');

/**
 * Initialize the entire security system
 * This should be called early in the application bootstrap process
 */
export function initSecuritySystem(): void {
  logger.info('Initializing OneAI security system');
  
  try {
    // Initialize all security components
    initBaseSecurityConfig();
    initSupabaseSecurity();
    initGeminiSecurity();
    initUISecurity();
    
    // Perform runtime security checks
    baseSecurityConfig.performSecurityChecks();
    
    logger.info('Security system initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize security system', { error });
    // Continue application execution, but with degraded security
  }
}

/**
 * Security System Configuration
 * - Export all security components in a unified interface
 */
export const Security = {
  // Base security configuration
  ...baseSecurityConfig,
  
  // Supabase-specific security
  supabase: supabaseSecurity,
  
  // Gemini AI security
  gemini: geminiSecurity,
  
  // UI and rendering security
  ui: uiSecurity,
  
  // Initialize the entire security system
  init: initSecuritySystem
};

export default Security;
