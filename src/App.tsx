
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import App as AppPage from '@/pages/App';
import SignIn from '@/pages/SignIn';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

function App() {
  return (
    <ErrorBoundaryWrapper>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/app" element={
                <AuthGuard>
                  <AppPage />
                </AuthGuard>
              } />
              <Route path="/" element={<Index />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;
