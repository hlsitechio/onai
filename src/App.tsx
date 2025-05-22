
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";
import { useEffect, useState } from "react";
import { validateStorageIntegrity, purgeUserData } from "./utils/securityUtils";
import { FocusModeProvider } from "./contexts";
import "./utils/gpuOptimizations"; // Import GPU optimization utilities
import "./styles/focus-mode.css"; // Import focus mode styles
import "./styles/globals.css"; // Import global styles

const queryClient = new QueryClient();

const App = () => {
  // State to track when app is fully loaded for animations
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  
  // Check for data integrity and implement privacy protections on mount
  useEffect(() => {
    // Validate storage integrity on app load
    const isIntegrityValid = validateStorageIntegrity();
    
    if (!isIntegrityValid) {
      console.warn('Storage integrity check failed. Resetting for security.');
      // Reset any suspicious data
      localStorage.removeItem('onlinenote-content');
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
    {/* Global glassmorphic background */}
    <div className="fixed inset-0 bg-black pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-noteflow-950/30 to-black backdrop-blur-md"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-noteflow-600/5 to-noteflow-400/5 blur-[120px] animate-float-slow"></div>
      <div className="absolute -bottom-[15%] -right-[5%] w-[35%] h-[35%] rounded-full bg-gradient-to-l from-noteflow-400/5 to-purple-500/5 blur-[100px] animate-float-medium"></div>
    </div>
    
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <CookieConsent />
      </FocusModeProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
