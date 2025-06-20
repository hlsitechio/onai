import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Account from '@/pages/Account';
import SharedNote from '@/pages/SharedNote';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { ToastProvider } from '@/components/ui/use-toast';
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
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/shared/:id" element={<SharedNote />} />
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
