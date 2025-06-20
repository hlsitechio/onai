
import { AuthError } from '@supabase/supabase-js';
import { logOAuthEvent } from './enhancedSecurityLogger';

export interface OAuthErrorInfo {
  error: string;
  description?: string;
  provider?: string;
  step?: string;
}

export const handleOAuthError = async (error: AuthError | Error, provider: string = 'unknown'): Promise<OAuthErrorInfo> => {
  const errorInfo: OAuthErrorInfo = {
    error: error.message,
    provider,
    step: 'unknown'
  };

  // Categorize OAuth errors for better handling
  if (error.message.includes('redirect_uri_mismatch')) {
    errorInfo.step = 'redirect_validation';
    errorInfo.description = 'The redirect URI provided does not match the one configured in the OAuth provider.';
    
    await logOAuthEvent('oauth_error', provider, {
      error_type: 'redirect_uri_mismatch',
      message: error.message
    });
  } else if (error.message.includes('OAuth state parameter missing')) {
    errorInfo.step = 'state_validation';
    errorInfo.description = 'OAuth state parameter is missing, which could indicate a security issue or session problem.';
    
    await logOAuthEvent('oauth_error', provider, {
      error_type: 'missing_state_parameter',
      message: error.message
    });
  } else if (error.message.includes('access_denied')) {
    errorInfo.step = 'user_consent';
    errorInfo.description = 'User denied access during OAuth flow.';
    
    await logOAuthEvent('oauth_error', provider, {
      error_type: 'access_denied',
      message: error.message
    });
  } else if (error.message.includes('invalid_request')) {
    errorInfo.step = 'request_validation';
    errorInfo.description = 'Invalid OAuth request parameters.';
    
    await logOAuthEvent('oauth_error', provider, {
      error_type: 'invalid_request',
      message: error.message
    });
  } else {
    errorInfo.step = 'unknown';
    errorInfo.description = 'An unexpected OAuth error occurred.';
    
    await logOAuthEvent('oauth_error', provider, {
      error_type: 'unknown',
      message: error.message
    });
  }

  return errorInfo;
};

export const getOAuthErrorSuggestion = (errorInfo: OAuthErrorInfo): string => {
  switch (errorInfo.step) {
    case 'redirect_validation':
      return 'Please check that the redirect URI is correctly configured in your OAuth provider settings.';
    case 'state_validation':
      return 'Try clearing your browser cache and cookies, then attempt to sign in again.';
    case 'user_consent':
      return 'Please try signing in again and grant the necessary permissions.';
    case 'request_validation':
      return 'There was an issue with the sign-in request. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }
};
