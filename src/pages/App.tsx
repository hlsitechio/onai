import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import EditorManager from "@/components/editor/EditorManager";
import ErrorBoundary from "@/components/ErrorBoundary";
import SentryTestButton from "@/components/SentryTestButton";
const App = () => {
  return <ErrorBoundary>
      <DebugWrapper componentName="App">
        {/* Temporary Sentry Test Button - Remove after testing */}
        
        
        <EditorManager />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </DebugWrapper>
    </ErrorBoundary>;
};
export default App;