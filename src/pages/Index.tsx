
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AIFeatures from "@/components/AIFeatures";
import FeatureShowcase from "@/components/FeatureShowcase";
import Testimonials from "@/components/Testimonials";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import EditorManager from "@/components/editor/EditorManager";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <DebugWrapper componentName="Index">
      <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <AIFeatures />
        <FeatureShowcase />
        <Testimonials />
        <SponsorsWallOfFame />
        
        {/* Show editor section for authenticated users */}
        {user && (
          <section id="editor-section" className="py-16 px-4 bg-black/40 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
                  Your Notes
                </h2>
                <p className="text-lg text-gray-300">
                  Start writing and let AI enhance your ideas
                </p>
              </div>
              <EditorManager />
            </div>
          </section>
        )}
        
        <Footer />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </div>
    </DebugWrapper>
  );
};

export default Index;
