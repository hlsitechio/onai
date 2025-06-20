import React, { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logAuthenticationEvent, logOAuthEvent } from '@/utils/enhancedSecurityLogger';
import { handleOAuthError, getOAuthErrorSuggestion } from '@/utils/oauthErrorHandler';

// Ensure React is available before using hooks
if (!React || typeof React.useState !== 'function') {
  throw new Error('React is not properly loaded - cannot use hooks');
}

export function useEnhancedAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          const provider = session.user.app_metadata?.provider || 'email';
          await logAuthenticationEvent('login_success', provider as any, {
            user_id: session.user.id,
            email: session.user.email
          });
        } else if (event === 'SIGNED_OUT') {
          await logAuthenticationEvent('logout', 'email');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      await logAuthenticationEvent('login_attempt', 'email', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      
      await logAuthenticationEvent('login_failure', 'email', {
        email,
        error: (error as Error).message
      });

      toast({
        title: 'Sign in failed',
        description: (error as Error).message,
        variant: 'destructive',
      });

      return { data: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/app`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      
      toast({
        title: 'Sign up failed',
        description: (error as Error).message,
        variant: 'destructive',
      });

      return { data: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      
      await logOAuthEvent('oauth_start', 'google');

      const redirectUrl = `${window.location.origin}/app`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;

      await logOAuthEvent('oauth_callback', 'google', {
        success: true
      });

      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      
      const errorInfo = await handleOAuthError(error as AuthError, 'google');
      const suggestion = getOAuthErrorSuggestion(errorInfo);

      toast({
        title: 'Google sign in failed',
        description: suggestion,
        variant: 'destructive',
      });

      return { data: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };
}
