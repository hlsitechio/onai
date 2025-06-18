
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Loader2 } from 'lucide-react';
import { SignUpData } from '@/hooks/useAuthForms';

interface SignUpFormProps {
  signUpData: SignUpData;
  updateSignUpData: (field: keyof SignUpData, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  signUpData,
  updateSignUpData,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={signUpData.email}
        onChange={(e) => updateSignUpData('email', e.target.value)}
        className="bg-white/5 border-white/10 text-white"
        required
      />
      
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Create a password"
        value={signUpData.password}
        onChange={(e) => updateSignUpData('password', e.target.value)}
        className="bg-white/5 border-white/10 text-white"
        required
      />
      
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={signUpData.confirmPassword}
        onChange={(e) => updateSignUpData('confirmPassword', e.target.value)}
        className="bg-white/5 border-white/10 text-white"
        required
      />
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-noteflow-500 to-purple-500 hover:from-noteflow-600 hover:to-purple-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};
