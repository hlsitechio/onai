
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={signUpData.email}
            onChange={(e) => updateSignUpData('email', e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={signUpData.password}
            onChange={(e) => updateSignUpData('password', e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signup-confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={signUpData.confirmPassword}
            onChange={(e) => updateSignUpData('confirmPassword', e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
            disabled={isLoading}
          />
        </div>
      </div>
      
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
