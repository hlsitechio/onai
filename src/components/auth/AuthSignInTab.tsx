
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';

interface AuthSignInTabProps {
  email: string;
  password: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => void;
}

export const AuthSignInTab: React.FC<AuthSignInTabProps> = ({
  email,
  password,
  isLoading,
  setEmail,
  setPassword,
  handleSignIn,
}) => {
  return (
    <TabsContent value="signin" className="space-y-4 mt-6">
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email" className="text-gray-200 font-medium">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
            <Input
              id="signin-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-300 rounded-lg"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signin-password" className="text-gray-200 font-medium">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
            <Input
              id="signin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-300 rounded-lg"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] border border-blue-500/30"
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </TabsContent>
  );
};
