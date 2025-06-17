
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import EditorManager from "@/components/editor/EditorManager";

const App = () => {
  return (
    <DebugWrapper componentName="App">
      <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
        <Header />
        
        {/* Main app content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
                Your Notes
              </h1>
              <p className="text-lg text-gray-300">
                Start writing and let AI enhance your ideas
              </p>
            </div>
            <EditorManager />
          </div>
        </section>
        
        <Footer />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </div>
    </DebugWrapper>
  );
};

export default App;
