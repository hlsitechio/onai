
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sendWelcomeEmail } from '@/utils/welcomeEmailService';
import { attemptSignUp } from '@/utils/userValidationService';
import { SignInData, SignUpData } from './useAuthForms';
import { logger } from '@/utils/consoleControl';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (signInData: SignInData) => {
    if (!signInData.email || !signInData.password) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        let errorMessage = 'An error occurred during sign in.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        }
        
        toast({
          title: 'Sign in failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
        navigate('/');
      }
    } catch (error) {
      logger.error('Sign-in error:', error);
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    signUpData: SignUpData, 
    clearForm: () => void, 
    setActiveTab: (tab: string) => void, 
    setSignInData: (data: SignInData) => void
  ) => {
    if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      logger.debug('AuthPage: Starting enhanced sign-up process...');
      
      const result = await attemptSignUp(signUpData.email, signUpData.password);
      
      if (!result.success) {
        if (result.userExists) {
          logger.debug('AuthPage: User exists, showing appropriate message');
          
          toast({
            title: 'Account already exists',
            description: `This email is already registered. Please switch to the Sign In tab. (Detected via ${result.validationMethod})`,
            variant: 'destructive',
          });
          
          // Automatically switch to sign in tab and pre-fill email
          setActiveTab('signin');
          setSignInData({ email: signUpData.email, password: '' });
          
          setIsLoading(false);
          return;
        }
        
        let errorMessage = 'An error occurred during sign up.';
        
        if (result.error?.message) {
          const msg = result.error.message.toLowerCase();
          if (msg.includes('password should be')) {
            errorMessage = 'Password must be at least 6 characters long.';
          } else if (msg.includes('invalid email')) {
            errorMessage = 'Please enter a valid email address.';
          } else if (msg.includes('weak password')) {
            errorMessage = 'Password is too weak. Please choose a stronger password.';
          } else {
            errorMessage = result.error.message;
          }
        }
        
        toast({
          title: 'Sign up failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        logger.debug('AuthPage: Sign-up successful, sending welcome email...');
        
        toast({
          title: 'Account created!',
          description: 'Please check your email for a confirmation link.',
        });
        
        try {
          logger.debug('AuthPage: Attempting to send welcome email to:', signUpData.email);
          const emailResult = await sendWelcomeEmail(signUpData.email);
          
          if (emailResult.success) {
            logger.debug('AuthPage: Welcome email sent successfully');
          } else {
            logger.error('AuthPage: Failed to send welcome email:', emailResult.error);
          }
        } catch (emailError) {
          logger.error('AuthPage: Error sending welcome email:', emailError);
        }
        
        clearForm();
      }
    } catch (error) {
      logger.error('AuthPage: Unexpected sign-up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
  };
};
