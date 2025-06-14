
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import TextEditor from "@/components/TextEditor";
import { useFocusMode } from "@/contexts";
import Footer from "@/components/Footer";
import VisitorCounter from "@/components/VisitorCounter";
import JoinWallOfFame from "@/components/JoinWallOfFame";
import DotGridBackground from "@/components/DotGridBackground";
import { Separator } from "@/components/ui/separator";
import "../styles/hide-separators.css";
import React, { lazy, Suspense } from "react";

// Lazy load FeatureShowcase since it's only shown on desktop and not critical for initial load
const FeatureShowcase = lazy(() => import("@/components/FeatureShowcase"));

// Loading component for FeatureShowcase
const FeatureShowcaseLoader = () => (
  <div className="py-16 flex justify-center">
    <div className="animate-pulse text-white/40">Loading features...</div>
  </div>
);

const Index = () => {
  // Use focus mode context to determine visibility of elements
  const {
    isFocusMode
  } = useFocusMode();
  
  return <div className="min-h-screen flex flex-col w-screen max-w-[100vw] overflow-x-hidden relative">
      {/* Global dot grid background for the main page */}
      <DotGridBackground />
      
      {/* Header and Hero use blur-in-focus-mode class instead of conditional rendering */}
      <div className="blur-in-focus-mode relative z-10">
        <Header />
        <Hero />
      </div>
      
      {/* Feature showcase section - Moved right after Hero */}
      <div className="blur-in-focus-mode hidden md:block relative z-10">
        <Suspense fallback={<FeatureShowcaseLoader />}>
          <FeatureShowcase />
        </Suspense>
      </div>
      
      {/* Main editor section with expanded sizing */}
      <div id="editor-section" className="w-full relative z-10 flex-1">
        {/* Beta Test Banner - Smaller on mobile */}
        <div className="w-full px-4 md:px-6 lg:px-8 mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg text-center py-2 md:py-3 px-3 md:px-4">
            <span className="text-orange-300 font-medium text-xs md:text-sm">
              🧪 Beta Test - This application is currently in beta testing phase
            </span>
          </div>
        </div>
        
        {/* Full-width editor container with minimal padding */}
        <div className="w-full px-2 md:px-4 lg:px-6">
          <TextEditor />
        </div>
      </div>
      
      {/* Sponsors Wall of Fame - Moved after the editor section */}
      <div className="blur-in-focus-mode relative z-10 mt-8 md:mt-12 lg:mt-16">
        <SponsorsWallOfFame />
      </div>
      
      {/* Join Our Wall of Fame section - After Sponsors Wall of Fame */}
      <div className="blur-in-focus-mode relative z-10">
        <JoinWallOfFame />
      </div>
      
      {/* Compact mobile footer - Hide any separator before it */}
      <div className="blur-in-focus-mode relative z-10">
        <Footer />
      </div>

      {/* Visitor Counter Widget */}
      <VisitorCounter />
    </div>;
};

export default Index;
