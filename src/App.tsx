
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import ToastProvider from '@/components/providers/ToastProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Notes = lazy(() => import('@/pages/Notes'));
const Auth = lazy(() => import('@/pages/Auth'));
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedAuthProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/error-dashboard" element={<ErrorDashboard />} />
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

export default App;
