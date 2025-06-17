
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthHeader } from './AuthHeader';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { useAuthForms } from '@/hooks/useAuthForms';
import { useAuthActions } from '@/hooks/useAuthActions';

interface AuthLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ activeTab, setActiveTab }) => {
  const {
    signInData,
    signUpData,
    updateSignInData,
    updateSignUpData,
    clearSignUpData,
    setSignInData,
  } = useAuthForms();

  const { isLoading, handleSignIn, handleSignUp } = useAuthActions();

  const onSignIn = () => handleSignIn(signInData);
  
  const onSignUp = () => handleSignUp(signUpData, clearSignUpData, setActiveTab, setSignInData);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
              Welcome
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="signin" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-noteflow-500">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-noteflow-500">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <SignInForm
                  signInData={signInData}
                  updateSignInData={updateSignInData}
                  onSubmit={onSignIn}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <SignUpForm
                  signUpData={signUpData}
                  updateSignUpData={updateSignUpData}
                  onSubmit={onSignUp}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
