
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthBrandingPanel } from '@/components/auth/AuthBrandingPanel';
import { AuthFormPanel } from '@/components/auth/AuthFormPanel';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-black">
      <AuthBrandingPanel />
      <AuthFormPanel />
    </div>
  );
};

export default Auth;
