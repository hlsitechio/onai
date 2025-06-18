
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import AppPage from '@/pages/App';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import ReactCompatibilityCheck from '@/components/ReactCompatibilityCheck';

function App() {
  return (
    <ReactCompatibilityCheck>
      <ErrorBoundaryWrapper>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/app" element={
                  <AuthGuard>
                    <AppPage />
                  </AuthGuard>
                } />
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundaryWrapper>
    </ReactCompatibilityCheck>
  );
}

export default App;
