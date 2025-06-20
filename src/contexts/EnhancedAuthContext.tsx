
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const useEnhancedAuthContext = () => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuthContext must be used within an EnhancedAuthProvider');
  }
  return context;
};

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useEnhancedAuth();

  return (
    <EnhancedAuthContext.Provider value={auth}>
      {children}
    </EnhancedAuthContext.Provider>
  );
};
