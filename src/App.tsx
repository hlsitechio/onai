
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DotGridBackground from "@/components/DotGridBackground";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { validateStorageIntegrity, purgeUserData } from "./utils/securityUtils";
import { PerformanceDashboard } from "./components/performance/PerformanceDashboard";
import { useParams, useLocation } from "react-router-dom";
import { FocusModeProvider } from "./contexts";
import { SecurityProvider } from "./utils/security/securityMiddleware.tsx";
import { SubscriptionManager } from "./components/subscription/SubscriptionManager";
import "./utils/gpuOptimizations"; // Import GPU optimization utilities
import "./styles/focus-mode.css"; // Import focus mode styles
import "./styles/globals.css"; // Import global styles
import "./styles/fix-separation.css"; // Import separation fix styles
import "./styles/horizontal-line-fix.css"; // Import horizontal line fix

// Lazy load pages that are accessed less frequently
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsOfUse = lazy(() => import("./pages/terms-of-use"));
const CookieSettings = lazy(() => import("./pages/cookie-settings"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Pricing = lazy(() => import("./pages/Pricing"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on certain errors
        if (error?.message?.includes('DOM') || error?.message?.includes('appendChild')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050510] to-[#0a0a1a]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-noteflow-400 mx-auto mb-4"></div>
      <p className="text-white/60">Loading...</p>
    </div>
  </div>
);

// App initialization component
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize and validate storage integrity on app load
        const isIntegrityValid = validateStorageIntegrity();
        
        // Only log if there are actual issues (not normal initialization)
        if (!isIntegrityValid) {
          console.info('Storage initialized for security compliance');
        }
        
        // Check if emergency data cleanup is needed (24-hour policy)
        const checkDataRetention = () => {
          try {
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
          } catch (error) {
            console.warn('Data retention check failed:', error);
          }
        };
        
        // Run retention check
        checkDataRetention();
        
        // Set up interval to check retention periodically
        const retentionInterval = setInterval(checkDataRetention, 60 * 60 * 1000); // Check every hour
        
        setIsInitialized(true);
        
        // Store cleanup function for later use
        (window as Window & { __appCleanup?: () => void }).__appCleanup = () => clearInterval(retentionInterval);
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        setIsInitialized(true); // Allow app to continue even with errors
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      const customWindow = window as Window & { __appCleanup?: () => void };
      if (customWindow.__appCleanup) {
        customWindow.__appCleanup();
      }
    };
  }, []);

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (initError) {
    console.warn('App initialized with warnings:', initError);
  }

  return <>{children}</>;
};

const App = () => {
  // State to track when app is fully loaded for animations
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const params = useParams<{ tempKey?: string }>();
  const location = useLocation();
  
  // Check for imported note data via URL parameters
  useEffect(() => {
    const checkForImportedNote = () => {
      // Check if we have a tempKey parameter
      const tempKey = params.tempKey;
      
      if (tempKey && tempKey.startsWith('oneai-temp-import-')) {
        try {
          // Retrieve the note data from localStorage
          const noteDataJson = localStorage.getItem(tempKey);
          
          if (noteDataJson) {
            const noteData = JSON.parse(noteDataJson);
            
            // Dispatch a custom event with the imported note data
            const importEvent = new CustomEvent('oneai-note-import', { 
              detail: noteData 
            });
            document.dispatchEvent(importEvent);
            
            // Clean up the temporary storage
            localStorage.removeItem(tempKey);
            
            // Redirect to home without the parameter
            window.history.replaceState({}, document.title, '/');
          }
        } catch (error) {
          console.error('Error importing note:', error);
        }
      }
    };
    
    // Call the function to check for imported notes
    checkForImportedNote();
  }, [params, location.pathname]);
  
  // Set app as loaded after a slight delay for animations
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SecurityProvider>
            <FocusModeProvider>
              <ErrorBoundary>
                <AppInitializer>
                  {/* Global dot grid background */}
                  <DotGridBackground />
                  
                  <Toaster />
                  <Sonner />
                  {/* Performance monitoring dashboard - outside router to avoid nesting issues */}
                  <PerformanceDashboard />
                  <div className={`transition-opacity duration-500 ${isAppLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Analytics component for tracking route changes */}
                    <GoogleAnalytics />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/roadmap" element={
                        <Suspense fallback={<PageLoader />}>
                          <Roadmap />
                        </Suspense>
                      } />
                      {/* Support both kebab-case and PascalCase URLs for legal pages */}
                      <Route path="/privacy-policy" element={
                        <Suspense fallback={<PageLoader />}>
                          <PrivacyPolicy />
                        </Suspense>
                      } />
                      <Route path="/PrivacyPolicy" element={
                        <Suspense fallback={<PageLoader />}>
                          <PrivacyPolicy />
                        </Suspense>
                      } />
                      <Route path="/terms-of-use" element={
                        <Suspense fallback={<PageLoader />}>
                          <TermsOfUse />
                        </Suspense>
                      } />
                      <Route path="/TermsofUse" element={
                        <Suspense fallback={<PageLoader />}>
                          <TermsOfUse />
                        </Suspense>
                      } />
                      <Route path="/cookie-settings" element={
                        <Suspense fallback={<PageLoader />}>
                          <CookieSettings />
                        </Suspense>
                      } />
                      <Route path="/CookieSettings" element={
                        <Suspense fallback={<PageLoader />}>
                          <CookieSettings />
                        </Suspense>
                      } />
                      <Route path="/pricing" element={
                        <Suspense fallback={<PageLoader />}>
                          <Pricing />
                        </Suspense>
                      } />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <CookieConsent />
                    <ScrollToTop />
                  </div>
                </AppInitializer>
              </ErrorBoundary>
            </FocusModeProvider>
          </SecurityProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
