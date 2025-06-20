
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import ToastProvider from '@/components/providers/ToastProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthGuard from '@/components/AuthGuard';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Notes = lazy(() => import('@/pages/Notes'));
const App = lazy(() => import('@/pages/App'));
const Auth = lazy(() => import('@/pages/Auth'));
const Landing = lazy(() => import('@/pages/Landing'));
const ContactUs = lazy(() => import('@/pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('@/pages/privacy-policy'));
const TermsOfUse = lazy(() => import('@/pages/terms-of-use'));
const CookieSettings = lazy(() => import('@/pages/cookie-settings'));
const Success = lazy(() => import('@/pages/Success'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ErrorDashboard = lazy(() => import('@/pages/ErrorDashboard'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedAuthProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/contactus" element={<ContactUs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/cookie-settings" element={<CookieSettings />} />
                  <Route path="/success" element={<Success />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/app" 
                    element={
                      <AuthGuard>
                        <App />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/notes" 
                    element={
                      <AuthGuard>
                        <Notes />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/error-dashboard" 
                    element={
                      <AuthGuard>
                        <ErrorDashboard />
                      </AuthGuard>
                    } 
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </ToastProvider>
      </EnhancedAuthProvider>
    </QueryClientProvider>
  );
}

export default AppRouter;
