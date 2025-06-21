
import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileLayout from './mobile/MobileLayout';
import AppLayout from '@/app/layout/AppLayout';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';

const MainLayout: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  return (
    <ErrorBoundaryWrapper>
      {isMobile ? <MobileLayout /> : <AppLayout />}
    </ErrorBoundaryWrapper>
  );
};

export default MainLayout;
