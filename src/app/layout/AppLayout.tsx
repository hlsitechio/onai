
import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileLayout from '@/components/mobile/MobileLayout';
import EditorManager from './EditorManager';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

const AppLayout: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  return (
    <ErrorBoundaryWrapper>
      {isMobile ? <MobileLayout /> : <EditorManager />}
    </ErrorBoundaryWrapper>
  );
};

export default AppLayout;
