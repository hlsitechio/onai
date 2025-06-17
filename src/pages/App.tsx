
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import NotesDashboard from "@/components/notes/NotesDashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <DebugWrapper componentName="App">
        <NotesDashboard />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </DebugWrapper>
    </ErrorBoundary>
  );
};

export default App;
