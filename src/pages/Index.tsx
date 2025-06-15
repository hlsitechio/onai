
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
import PWADashboard from "@/components/pwa/PWADashboard";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-black relative">
      {/* Enhanced Dark Background */}
      <DotGridBackground />
      
      {/* PWA Components */}
      <PWAInstaller />
      <IOSInstallPrompt />
      <OfflineIndicator />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section - Simplified */}
      <div className="relative z-10">
        <Hero />
      </div>
      
      {/* Our Technologies Section - Moved directly below Hero */}
      <div className="relative z-10">
        <SponsorsWallOfFame />
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
          <EditorManager />
        </div>
      </section>
      
      {/* Features Section */}
      <div className="relative z-10">
        <Features />
      </div>

      {/* PWA Dashboard Section - New enhanced PWA features */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Progressive Web App Features
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              Experience the power of modern web technology
            </p>
          </div>
          <PWADashboard />
        </div>
      </section>
      
      {/* Individual Supporters Section - Moved below Features */}
      <div className="relative z-10">
        <IndividualSupportersSection />
      </div>
      
      {/* Sitemap Section */}
      <div className="relative z-10">
        <SitemapSection />
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default Index;
