
import React from 'react';
import ToastProvider from '@/components/providers/ToastProvider';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAProvider } from '@/components/pwa/PWAProvider';
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfUse from "./pages/terms-of-use";
import CookieSettings from "./pages/cookie-settings";
import NotFound from "./pages/NotFound";
import PWAUpdateNotifier from '@/components/pwa/PWAUpdateNotifier';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PWAProvider>
        <BrowserRouter>
          <ToastProvider>
            <PWAUpdateNotifier />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </BrowserRouter>
      </PWAProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
