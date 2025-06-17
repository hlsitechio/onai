
import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileLayout from './mobile/MobileLayout';
import EditorManager from './editor/EditorManager';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';

const MainLayout: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  return (
    <ErrorBoundaryWrapper>
      {isMobile ? <MobileLayout /> : <EditorManager />}
    </ErrorBoundaryWrapper>
  );
};

export default MainLayout;
