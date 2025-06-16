
import React from 'react';
import VercelDashboard from '@/components/vercel/VercelDashboard';
import Header from '@/components/Header';

const VercelDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
      <Header />
      <VercelDashboard />
    </div>
  );
};

export default VercelDashboardPage;
