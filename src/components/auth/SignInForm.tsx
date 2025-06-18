
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Loader2 } from 'lucide-react';
import { SignInData } from '@/hooks/useAuthForms';

interface SignInFormProps {
  signInData: SignInData;
  updateSignInData: (field: keyof SignInData, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  signInData,
  updateSignInData,
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
        value={signInData.email}
        onChange={(e) => updateSignInData('email', e.target.value)}
        className="bg-white/5 border-white/10 text-white"
        required
      />
      
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={signInData.password}
        onChange={(e) => updateSignInData('password', e.target.value)}
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
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};
