
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EditorManager from "@/components/editor/EditorManager";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import IndividualSupportersSection from "@/components/IndividualSupportersSection";
import SitemapSection from "@/components/SitemapSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import DotGridBackground from "@/components/DotGridBackground";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import IOSInstallPrompt from "@/components/pwa/iOSInstallPrompt";
import OfflineIndicator from "@/components/pwa/OfflineIndicator";
import ErrorBoundary from "@/components/ErrorBoundary";
import DebugWrapper from "@/components/DebugWrapper";

const Index = () => {
  console.log('Index component rendering');
  
  return (
    <div className="min-h-screen w-full overflow-hidden bg-black relative">
      {/* Enhanced Dark Background */}
      <ErrorBoundary fallback={<div className="text-white p-4">Background component failed to load</div>}>
        <DebugWrapper componentName="DotGridBackground">
          <DotGridBackground />
        </DebugWrapper>
      </ErrorBoundary>
      
      {/* PWA Components */}
      <ErrorBoundary fallback={<div className="text-white p-2">PWA components not available</div>}>
        <DebugWrapper componentName="PWA Components">
          <PWAInstaller />
          <IOSInstallPrompt />
          <OfflineIndicator />
        </DebugWrapper>
      </ErrorBoundary>
      
      {/* Header */}
      <ErrorBoundary fallback={<div className="text-white p-4 text-center">Header failed to load</div>}>
        <DebugWrapper componentName="Header">
          <Header />
        </DebugWrapper>
      </ErrorBoundary>
      
      {/* Hero Section - Simplified */}
      <div className="relative z-10">
        <ErrorBoundary fallback={<div className="text-white p-4 text-center">Hero section failed to load</div>}>
          <DebugWrapper componentName="Hero">
            <Hero />
          </DebugWrapper>
        </ErrorBoundary>
      </div>
      
      {/* Our Technologies Section - Moved directly below Hero */}
      <div className="relative z-10">
        <ErrorBoundary fallback={<div className="text-white p-4 text-center">Sponsors section failed to load</div>}>
          <DebugWrapper componentName="SponsorsWallOfFame">
            <SponsorsWallOfFame />
          </DebugWrapper>
        </ErrorBoundary>
      </div>
      
      {/* Main Editor Section - Centralized and Prominent */}
      <section id="editor-section" className="relative z-10 min-h-screen flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Start Writing Now
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              AI-powered notes. No signup required.
            </p>
          </div>
          <ErrorBoundary fallback={<div className="text-white p-4 text-center">Editor failed to load</div>}>
            <DebugWrapper componentName="EditorManager">
              <EditorManager />
            </DebugWrapper>
          </ErrorBoundary>
        </div>
      </section>
      
      {/* Features Section */}
      <div className="relative z-10">
        <ErrorBoundary fallback={<div className="text-white p-4 text-center">Features section failed to load</div>}>
          <DebugWrapper componentName="Features">
            <Features />
          </DebugWrapper>
        </ErrorBoundary>
      </div>
      
      {/* Individual Supporters Section - Moved below Features */}
      <div className="relative z-10">
        <ErrorBoundary fallback={<div className="text-white p-4 text-center">Supporters section failed to load</div>}>
          <DebugWrapper componentName="IndividualSupportersSection">
            <IndividualSupportersSection />
          </DebugWrapper>
        </ErrorBoundary>
      </div>
      
      {/* Sitemap Section */}
      <div className="relative z-10">
        <ErrorBoundary fallback={<div className="text-white p-4 text-center">Sitemap section failed to load</div>}>
          <DebugWrapper componentName="SitemapSection">
            <SitemapSection />
          </DebugWrapper>
        </ErrorBoundary>
      </div>
      
      {/* Footer */}
      <ErrorBoundary fallback={<div className="text-white p-4 text-center">Footer failed to load</div>}>
        <DebugWrapper componentName="Footer">
          <Footer />
        </DebugWrapper>
      </ErrorBoundary>
      
      {/* Cookie Consent */}
      <ErrorBoundary fallback={<div className="text-white p-2">Cookie consent failed to load</div>}>
        <DebugWrapper componentName="CookieConsent">
          <CookieConsent />
        </DebugWrapper>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
