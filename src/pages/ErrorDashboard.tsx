
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { ErrorMonitoringProvider } from '@/contexts/ErrorMonitoringContext';
import ErrorDashboard from '@/components/monitoring/ErrorDashboard';
import { Loader2 } from 'lucide-react';

const ErrorDashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/notes" replace />;
  }

  return (
    <ErrorMonitoringProvider>
      <ErrorDashboard />
    </ErrorMonitoringProvider>
  );
};

export default ErrorDashboardPage;
