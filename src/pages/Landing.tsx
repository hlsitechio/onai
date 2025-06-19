
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
      <div className="min-h-screen bg-gradient-to-br from-[#020010] via-[#050520] to-[#0a0518] relative overflow-x-hidden">
        {/* Enhanced Global animated background overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(120, 60, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 60, 120, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(60, 255, 200, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.08) 0%, transparent 40%)
              `
            }}
          />
          {/* Animated mesh gradient with better performance */}
          <div 
            className="absolute inset-0 opacity-20 animate-pulse"
            style={{
              background: `
                conic-gradient(from 0deg at 50% 50%, 
                  rgba(120, 60, 255, 0.08) 0deg, 
                  rgba(255, 60, 120, 0.08) 90deg, 
                  rgba(60, 255, 200, 0.08) 180deg, 
                  rgba(147, 51, 234, 0.08) 270deg, 
                  rgba(120, 60, 255, 0.08) 360deg)
              `,
              animation: 'spin 25s linear infinite'
            }}
          />
          {/* Additional floating particles */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${15 + i * 12}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              />
            ))}
          </div>
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
