
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeatureShowcase from "@/components/FeatureShowcase";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import PricingSection from "@/components/PricingSection";

const Landing = () => {
  return (
    <DebugWrapper componentName="Landing">
      <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
        <Header />
        <Hero />
        <WhyChooseUs />
        <FeatureShowcase />
        <PricingSection />
        <SponsorsWallOfFame />
        <Footer />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </div>
    </DebugWrapper>
  );
};

export default Landing;
