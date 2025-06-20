
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import EditorManager from "@/components/editor/EditorManager";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorMonitorButton from "@/components/monitoring/ErrorMonitorButton";

const App = () => {
  return <ErrorBoundary>
      <DebugWrapper componentName="App">
        <EditorManager />
        <PWAInstaller />
        <PWAUpdateNotifier />
        <ErrorMonitorButton />
      </DebugWrapper>
    </ErrorBoundary>;
};

export default App;
