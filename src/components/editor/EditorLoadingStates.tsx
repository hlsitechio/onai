
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  loading: boolean;
  user: any;
}

export const EditorLoadingState: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
      <p className="text-gray-300">Loading your notes...</p>
    </div>
  </div>
);

export const AuthRequiredState: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
    <div className="text-center max-w-md">
      <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-4">Authentication Required</h2>
      <p className="text-gray-400 mb-6">Please sign in to access your notes and start taking notes.</p>
      <Button 
        onClick={() => window.location.href = '/auth'} 
        className="bg-noteflow-500 hover:bg-noteflow-600"
      >
        Sign In
      </Button>
    </div>
  </div>
);

export const EditorLoadingStates: React.FC<LoadingStateProps> = ({ loading, user }) => {
  if (loading) {
    return <EditorLoadingState />;
  }

  if (!user) {
    return <AuthRequiredState />;
  }

  return null;
};
