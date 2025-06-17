
import { supabase } from '@/integrations/supabase/client';

export interface UserValidationResult {
  exists: boolean;
  hasPassword: boolean;
  method: string;
  error?: string;
}

/**
 * Comprehensive user existence check using multiple validation methods
 */
export const checkUserExists = async (email: string): Promise<UserValidationResult> => {
  try {
    console.log('UserValidation: Starting comprehensive check for:', email);
    
    // Method 1: Check user_profiles table directly
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, id')
      .eq('email', email.toLowerCase().trim())
      .limit(1);
    
    if (profileError) {
      console.error('UserValidation: Profile check error:', profileError);
    } else if (profiles && profiles.length > 0) {
      console.log('UserValidation: User found in profiles table');
      return {
        exists: true,
        hasPassword: true,
        method: 'profile_table'
      };
    }
    
    // Method 2: Attempt sign-in with a known incorrect password to check auth status
    console.log('UserValidation: Checking auth system...');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: 'temp-validation-password-' + Date.now()
    });
    
    if (authError) {
      // Analyze the specific error to determine if user exists
      const errorMessage = authError.message.toLowerCase();
      
      if (errorMessage.includes('invalid login credentials') || 
          errorMessage.includes('invalid email or password') ||
          errorMessage.includes('email not confirmed')) {
        console.log('UserValidation: User exists (auth error indicates existing user)');
        return {
          exists: true,
          hasPassword: true,
          method: 'auth_error_analysis'
        };
      }
      
      if (errorMessage.includes('user not found') || 
          errorMessage.includes('no user found')) {
        console.log('UserValidation: User does not exist');
        return {
          exists: false,
          hasPassword: false,
          method: 'auth_error_analysis'
        };
      }
      
      // For other errors, we can't determine existence reliably
      console.log('UserValidation: Ambiguous auth error:', errorMessage);
    }
    
    // Method 3: Fallback - assume user doesn't exist if no clear indicators
    console.log('UserValidation: No clear indicators, assuming user does not exist');
    return {
      exists: false,
      hasPassword: false,
      method: 'fallback_assumption'
    };
    
  } catch (error) {
    console.error('UserValidation: Unexpected error during validation:', error);
    return {
      exists: false,
      hasPassword: false,
      method: 'error_fallback',
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
};

/**
 * Enhanced sign-up with comprehensive validation
 */
export const attemptSignUp = async (email: string, password: string): Promise<{
  success: boolean;
  error?: any;
  userExists?: boolean;
  validationMethod?: string;
}> => {
  try {
    console.log('SignUp: Starting enhanced sign-up process for:', email);
    
    // First, check if user already exists
    const validation = await checkUserExists(email);
    
    if (validation.exists) {
      console.log('SignUp: User already exists, blocking sign-up');
      return {
        success: false,
        userExists: true,
        validationMethod: validation.method,
        error: {
          message: 'User already exists',
          details: `Account found via ${validation.method}`
        }
      };
    }
    
    // Proceed with sign-up
    console.log('SignUp: User validation passed, proceeding with registration');
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('SignUp: Supabase sign-up error:', error);
      
      // Check if this is actually a "user already exists" error that our validation missed
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('user already registered') || 
          errorMessage.includes('already been taken') ||
          errorMessage.includes('email address is already registered')) {
        return {
          success: false,
          userExists: true,
          validationMethod: 'supabase_signup_error',
          error: {
            message: 'User already exists',
            details: 'Detected during sign-up attempt'
          }
        };
      }
      
      return {
        success: false,
        userExists: false,
        error
      };
    }
    
    console.log('SignUp: Successfully completed registration');
    return {
      success: true,
      userExists: false,
      validationMethod: validation.method
    };
    
  } catch (error) {
    console.error('SignUp: Unexpected error during sign-up:', error);
    return {
      success: false,
      userExists: false,
      error: {
        message: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};
