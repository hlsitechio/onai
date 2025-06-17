
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import AuthPage from '@/pages/AuthPage';
import MainLayout from '@/components/MainLayout';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

function App() {
  return (
    <ErrorBoundaryWrapper>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/" 
                element={
                  <AuthGuard>
                    <MainLayout />
                  </AuthGuard>
                } 
              />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;
