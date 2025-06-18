
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AuthFormCardProps {
  children: React.ReactNode;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ children }) => {
  return (
    <div className="relative group">
      {/* Animated Glow Border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse transition-all duration-1000"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/30 via-violet-400/30 to-fuchsia-400/30 rounded-xl blur-md opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <Card className="relative border border-white/20 bg-black/40 backdrop-blur-2xl shadow-2xl rounded-xl overflow-hidden">
        {/* Inner Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
        
        <CardHeader className="text-center pb-6 relative">
          {/* Mobile Logo with Enhanced Glow */}
          <div className="lg:hidden mb-4">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-pulse opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-sm animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-full h-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-300/90 text-lg">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
