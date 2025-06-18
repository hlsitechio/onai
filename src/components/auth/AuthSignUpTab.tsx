
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';

interface AuthSignUpTabProps {
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  handleSignUp: (e: React.FormEvent) => void;
}

export const AuthSignUpTab: React.FC<AuthSignUpTabProps> = ({
  email,
  password,
  confirmPassword,
  isLoading,
  setEmail,
  setPassword,
  setConfirmPassword,
  handleSignUp,
}) => {
  return (
    <TabsContent value="signup" className="space-y-4 mt-6">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-gray-200 font-medium">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:bg-white/10 transition-all duration-300 rounded-lg"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-gray-200 font-medium">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:bg-white/10 transition-all duration-300 rounded-lg"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-gray-200 font-medium">Confirm Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-11 bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:bg-white/10 transition-all duration-300 rounded-lg"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] border border-purple-500/30"
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </TabsContent>
  );
};
