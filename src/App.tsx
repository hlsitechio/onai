
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DotGridBackground from "@/components/DotGridBackground";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { validateStorageIntegrity, purgeUserData } from "./utils/securityUtils";
import { FocusModeProvider } from "./contexts";
import "./utils/gpuOptimizations"; // Import GPU optimization utilities
import "./styles/focus-mode.css"; // Import focus mode styles
import "./styles/globals.css"; // Import global styles
import "./styles/fix-separation.css"; // Import separation fix styles
import "./styles/horizontal-line-fix.css"; // Import horizontal line fix

// Lazy load pages that are accessed less frequently
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsOfUse = lazy(() => import("./pages/terms-of-use"));
const CookieSettings = lazy(() => import("./pages/cookie-settings"));

const queryClient = new QueryClient();

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050510] to-[#0a0a1a]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-noteflow-400 mx-auto mb-4"></div>
      <p className="text-white/60">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // State to track when app is fully loaded for animations
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  
  // Check for data integrity and implement privacy protections on mount
  useEffect(() => {
    // Initialize and validate storage integrity on app load
    const isIntegrityValid = validateStorageIntegrity();
    
    // Only log if there are actual issues (not normal initialization)
    if (!isIntegrityValid) {
      console.info('Storage initialized for security compliance');
    }
    
    // Check if emergency data cleanup is needed (24-hour policy)
    const checkDataRetention = () => {
      const lastPurgeTime = localStorage.getItem('onlinenote-purged');
      
      if (!lastPurgeTime) {
        // Set initial purge time if not set
        localStorage.setItem('onlinenote-purged', new Date().toISOString());
        return;
      }
      
      // Calculate time since last purge
      const lastPurge = new Date(lastPurgeTime);
      const currentTime = new Date();
      const hoursSinceLastPurge = (currentTime.getTime() - lastPurge.getTime()) / (1000 * 60 * 60);
      
      // If more than 24 hours have passed, purge user data
      if (hoursSinceLastPurge >= 24) {
        purgeUserData();
      }
    };
    
    // Run retention check
    checkDataRetention();
    
    // Set up interval to check retention periodically
    const retentionInterval = setInterval(checkDataRetention, 60 * 60 * 1000); // Check every hour
    
    // Clean up interval on unmount
    return () => clearInterval(retentionInterval);
  }, []);
  
  // Set app as loaded after a slight delay for animations
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
  <QueryClientProvider client={queryClient}>
    {/* Global dot grid background */}
    <DotGridBackground />
    
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className={`transition-opacity duration-500 ${isAppLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <FocusModeProvider>
          <BrowserRouter>
        {/* Analytics component for tracking route changes */}
        <GoogleAnalytics />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="/terms-of-use" element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfUse />
            </Suspense>
          } />
          <Route path="/cookie-settings" element={
            <Suspense fallback={<PageLoader />}>
              <CookieSettings />
            </Suspense>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <CookieConsent />
      <ScrollToTop />
      </FocusModeProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
