
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";
import { useEffect } from "react";
import { validateStorageIntegrity, purgeUserData } from "./utils/securityUtils";

const queryClient = new QueryClient();

const App = () => {
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
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
