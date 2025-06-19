
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import IonosIntegration from '@/components/ionos/IonosIntegration';
import Header from '@/components/Header';

const IonosManagement = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />
      <div className="pt-16">
        <IonosIntegration />
      </div>
    </div>
  );
};

export default IonosManagement;
