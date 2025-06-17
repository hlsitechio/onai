
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AIFeatures from "@/components/AIFeatures";
import FeatureShowcase from "@/components/FeatureShowcase";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import PricingSection from "@/components/PricingSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  // If user is authenticated, redirect to the app
  if (user && !loading) {
    return <Navigate to="/app" replace />;
  }

  // Show landing page for non-authenticated users
  return (
    <DebugWrapper componentName="Index">
      <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
        <Header />
        <Hero />
        <SponsorsWallOfFame />
        <WhyChooseUs />
        <FeatureShowcase />
        <PricingSection />
        <Footer />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </div>
    </DebugWrapper>
  );
};

export default Index;
