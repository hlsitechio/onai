
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import { preloadCriticalResources } from "@/utils/bundleOptimization";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import AuthGuard from "@/components/AuthGuard";
import SharedNoteViewer from "@/components/SharedNoteViewer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Preload critical resources on app start
if (typeof window !== 'undefined') {
  preloadCriticalResources();
}

const App: React.FC = () => {
  return (
    <ErrorBoundaryWrapper>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <PWAProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/shared/:shareId" element={<SharedNoteViewer />} />
                  <Route
                    path="/"
                    element={
                      <AuthGuard>
                        <Index />
                      </AuthGuard>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </PWAProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
