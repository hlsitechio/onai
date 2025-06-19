
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EnhancedFeatures from "@/components/EnhancedFeatures";
import FeatureShowcase from "@/components/FeatureShowcase";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import PricingSection from "@/components/PricingSection";

const Landing = () => {
  return (
    <DebugWrapper componentName="Landing">
      <div className="min-h-screen bg-gradient-to-br from-[#020010] via-[#050520] to-[#0a0518] relative">
        {/* Enhanced Global animated background overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(120, 60, 255, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(255, 60, 120, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 40% 80%, rgba(60, 255, 200, 0.12) 0%, transparent 60%),
                radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
              `
            }}
          />
          {/* Animated mesh gradient */}
          <div 
            className="absolute inset-0 opacity-30 animate-pulse"
            style={{
              background: `
                conic-gradient(from 0deg at 50% 50%, 
                  rgba(120, 60, 255, 0.1) 0deg, 
                  rgba(255, 60, 120, 0.1) 90deg, 
                  rgba(60, 255, 200, 0.1) 180deg, 
                  rgba(147, 51, 234, 0.1) 270deg, 
                  rgba(120, 60, 255, 0.1) 360deg)
              `,
              animation: 'spin 20s linear infinite'
            }}
          />
        </div>
        
        <div className="relative z-10">
          <Header />
          <Hero />
          <SponsorsWallOfFame />
          <EnhancedFeatures />
          <FeatureShowcase />
          <PricingSection />
          <Footer />
          <PWAInstaller />
          <PWAUpdateNotifier />
        </div>
      </div>
    </DebugWrapper>
  );
};

export default Landing;
