
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EditorManager from "@/components/editor/EditorManager";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import SitemapSection from "@/components/SitemapSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import DotGridBackground from "@/components/DotGridBackground";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#050510] to-[#0a0518] relative">
      {/* Background */}
      <DotGridBackground />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section - Simplified */}
      <div className="relative z-10">
        <Hero />
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
      
      {/* Wall of Fame / Sponsors Section */}
      <div className="relative z-10">
        <SponsorsWallOfFame />
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
