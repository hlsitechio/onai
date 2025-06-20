
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <EnhancedAuthProvider>
          <AuthProvider>
            <ErrorBoundaryWrapper>
              <ToastProvider>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                  </Routes>
                </div>
              </ToastProvider>
            </ErrorBoundaryWrapper>
          </AuthProvider>
        </EnhancedAuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
