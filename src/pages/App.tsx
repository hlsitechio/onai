
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import NotesDashboard from "@/components/notes/NotesDashboard";

const App = () => {
  return (
    <DebugWrapper componentName="App">
      <NotesDashboard />
      <PWAInstaller />
      <PWAUpdateNotifier />
    </DebugWrapper>
  );
};

export default App;
