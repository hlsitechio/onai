
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

  // If user is authenticated, show the full editor interface
  if (user) {
    return (
      <DebugWrapper componentName="Index">
        <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
          <Header />
          <EditorManager />
          <PWAInstaller />
          <PWAUpdateNotifier />
        </div>
      </DebugWrapper>
    );
  }

  // If not authenticated, show the landing page
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
        <Footer />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </div>
    </DebugWrapper>
  );
};

export default Index;
