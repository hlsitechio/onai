
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import TextEditor from "@/components/TextEditor";
import { useFocusMode } from "@/contexts";
import Footer from "@/components/Footer";
import VisitorCounter from "@/components/VisitorCounter";
import JoinWallOfFame from "@/components/JoinWallOfFame";
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
  
  return <div className="min-h-screen flex flex-col w-screen max-w-[100vw] overflow-x-hidden">
      {/* Header and Hero use blur-in-focus-mode class instead of conditional rendering */}
      <div className="blur-in-focus-mode">
        <Header />
        <Hero />
      </div>
      
      {/* Sponsors Wall of Fame - New section after hero */}
      <div className="blur-in-focus-mode">
        <SponsorsWallOfFame />
      </div>
      
      {/* Main editor section with improved mobile spacing */}
      <div id="editor-section" className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10 max-w-[96%] lg:max-w-[94%] xl:max-w-[92%]">
        {/* Beta Test Banner - Smaller on mobile */}
        <div className="w-full max-w-[1200px] mx-auto mb-3 md:mb-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg text-center py-2 md:py-3 px-3 md:px-4">
            <span className="text-orange-300 font-medium text-xs md:text-sm">
              🧪 Beta Test - This application is currently in beta testing phase
            </span>
          </div>
        </div>
        
        {/* Reduced padding significantly to eliminate empty space */}
        <div className="mx-auto w-full py-6 md:py-8 lg:py-12">
          <div className="w-full max-w-[1200px] mx-auto">
            <TextEditor />
          </div>
        </div>
      </div>
      
      {/* Completely hidden section separator - no visual space */}
      <div className="hidden">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Visual separator with gradient line */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="relative bg-gradient-to-b from-[#050510] to-[#0a0a1a] px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-full"></div>
            </div>
          </div>
          
          {/* Optional decorative text */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-gray-400 text-sm font-medium">Discover Our Features</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature showcase section - Lazy loaded and reduced top margin */}
      <div className="blur-in-focus-mode hidden md:block">
        <Suspense fallback={<FeatureShowcaseLoader />}>
          <FeatureShowcase />
        </Suspense>
      </div>
      
      {/* Join Our Wall of Fame section - Moved after Feature Showcase */}
      <div className="blur-in-focus-mode">
        <JoinWallOfFame />
      </div>
      
      {/* Completely hidden separator before footer */}
      <div className="hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compact mobile footer - Hide any separator before it */}
      <div className="blur-in-focus-mode">
        <Footer />
      </div>

      {/* Visitor Counter Widget */}
      <VisitorCounter />
    </div>;
};

export default Index;
