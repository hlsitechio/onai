
import { useState } from 'react';

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuthForms = () => {
  const [signInData, setSignInData] = useState<SignInData>({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState<SignUpData>({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const updateSignInData = (field: keyof SignInData, value: string) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
  };

  const updateSignUpData = (field: keyof SignUpData, value: string) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
  };

  const clearSignUpData = () => {
    setSignUpData({ email: '', password: '', confirmPassword: '' });
  };

  return {
    signInData,
    signUpData,
    updateSignInData,
    updateSignUpData,
    clearSignUpData,
    setSignInData,
  };
};
