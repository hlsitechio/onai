
import React from 'react';
import WelcomePanel from '../../components/Auth/WelcomePanel';
import AuthForm from '../../components/Auth/AuthForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950">
      <WelcomePanel />
      <AuthForm />
    </div>
  );
};

export default Register;
