
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import AppPage from '@/pages/App';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Success from '@/pages/Success';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsOfUse from '@/pages/terms-of-use';
import IonosManagement from '@/pages/IonosManagement';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import ReactCompatibilityCheck from '@/components/ReactCompatibilityCheck';

function App() {
  // Ensure React is available before rendering
  if (!React || !React.useState || !React.useEffect) {
    console.error('CRITICAL: React hooks not available in App component');
    return (
      <div style={{
        padding: '20px',
        margin: '20px',
        backgroundColor: '#1a1a1a',
        color: '#ff6b6b',
        fontFamily: 'monospace',
        border: '1px solid #ff6b6b',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>React Error</h2>
        <p>React hooks are not properly loaded. Please refresh the page.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <ReactCompatibilityCheck>
      <ErrorBoundaryWrapper>
        <AuthProvider>
          <Router>
            <div className="App w-full min-h-screen">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/success" element={<Success />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/ionos" element={
                  <AuthGuard>
                    <IonosManagement />
                  </AuthGuard>
                } />
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
