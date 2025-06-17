
import React, { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return <AuthLayout activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default AuthPage;
