
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import App from '@/pages/App';
import Landing from '@/pages/Landing';
import ContactUs from '@/pages/ContactUs';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsOfUse from '@/pages/terms-of-use';
import CookieSettings from '@/pages/cookie-settings';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import ReactCompatibilityCheck from '@/components/ReactCompatibilityCheck';
import SentryTestComponent from '@/components/SentryTestComponent';
import ErrorDashboard from '@/components/monitoring/ErrorDashboard';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import { ErrorMonitoringProvider } from '@/contexts/ErrorMonitoringContext';

const queryClient = new QueryClient();

function AppRouter() {
  return (
    <ReactCompatibilityCheck>
      <Router>
        <QueryClientProvider client={queryClient}>
          <ErrorMonitoringProvider>
            <EnhancedAuthProvider>
              <AuthProvider>
                <ErrorBoundaryWrapper>
                  <ToastProvider>
                    <div className="min-h-screen bg-background">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/contactus" element={<ContactUs />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                        <Route path="/cookie-settings" element={<CookieSettings />} />
                        <Route path="/error-dashboard" element={<ErrorDashboard />} />
                        <Route 
                          path="/app" 
                          element={
                            <ProtectedRoute>
                              <App />
                            </ProtectedRoute>
                          } 
                        />
                      </Routes>
                      <SentryTestComponent />
                    </div>
                  </ToastProvider>
                </ErrorBoundaryWrapper>
              </AuthProvider>
            </EnhancedAuthProvider>
          </ErrorMonitoringProvider>
        </QueryClientProvider>
      </Router>
    </ReactCompatibilityCheck>
  );
}

export default AppRouter;
