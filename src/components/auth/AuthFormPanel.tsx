import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Brain } from 'lucide-react';

export const AuthFormPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
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
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        let errorMessage = 'An error occurred during sign up.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        toast({
          title: 'Sign up failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email for a confirmation link.',
        });
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-950/95 to-black/95 backdrop-blur-xl relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-purple-600/5"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Glowing Card Container */}
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
              <Tabs defaultValue="signin" className="w-full">
                {/* Enhanced Tab List */}
                <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1">
                  <TabsTrigger 
                    value="signin" 
                    className="relative text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 rounded-md transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="relative text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 rounded-md transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
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
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
