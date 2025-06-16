
import React from 'react';
import OptimizedVercelDashboard from '@/components/OptimizedVercelDashboard';
import Header from '@/components/Header';

const VercelDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
      <Header />
      <OptimizedVercelDashboard />
    </div>
  );
};

export default VercelDashboardPage;
