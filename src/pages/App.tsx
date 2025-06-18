
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import EditorManager from "@/components/editor/EditorManager";
import ErrorBoundary from "@/components/ErrorBoundary";
import SentryTestButton from "@/components/SentryTestButton";

const App = () => {
  return (
    <ErrorBoundary>
      <DebugWrapper componentName="App">
        {/* Temporary Sentry Test Button - Remove after testing */}
        <div className="fixed top-4 right-4 z-50 p-2 bg-black/80 rounded-lg border border-red-500/20">
          <p className="text-xs text-gray-300 mb-2">Sentry Test:</p>
          <SentryTestButton />
        </div>
        
        <EditorManager />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </DebugWrapper>
    </ErrorBoundary>
  );
};

export default App;
