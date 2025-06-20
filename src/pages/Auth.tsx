
import React from 'react';
import { Navigate } from 'react-router-dom';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import DotGridBackground from '@/components/DotGridBackground';

const Auth: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] relative">
      <DotGridBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <EnhancedAuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
