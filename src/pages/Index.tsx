
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AIFeatures from "@/components/AIFeatures";
import FeatureShowcase from "@/components/FeatureShowcase";
import Testimonials from "@/components/Testimonials";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import JoinWallOfFame from "@/components/JoinWallOfFame";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import EditorManager from "@/components/editor/EditorManager";
import CookieConsent from "@/components/CookieConsent";
import DotGridBackground from "@/components/DotGridBackground";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#050510] to-[#0a0518] relative">
      {/* Background */}
      <DotGridBackground />
      
      {/* Header */}
      <Header />
      
      {/* Landing Page Sections */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <AIFeatures />
        <FeatureShowcase />
        <Testimonials />
        <SponsorsWallOfFame />
        <JoinWallOfFame />
        <NewsletterSection />
      </div>
      
      {/* Editor Section */}
      <section id="editor-section" className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Start Writing Now
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the power of AI-enhanced note-taking. No signup required, start immediately.
            </p>
          </div>
          <EditorManager />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default Index;
