
import React, { useEffect } from 'react';
import DebugWrapper from "@/components/DebugWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import AppLayout from "./layout/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <DebugWrapper componentName="App">
        <AppLayout />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </DebugWrapper>
    </ErrorBoundary>
  );
};

export default App;
