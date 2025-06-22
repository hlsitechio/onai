
<<<<<<< HEAD
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
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';

const queryClient = new QueryClient();

function AppRouter() {
  return (
    <ReactCompatibilityCheck>
      <Router>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </Router>
    </ReactCompatibilityCheck>
  );
}

export default AppRouter;
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Context providers
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';

// Layout
import Layout from './components/Layout/Layout';

// Page components
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Editor from './pages/Editor';
import Calendar from './pages/Calendar';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<Register />} />
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/register" element={<Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <NotesProvider>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/chat" element={<Layout><Chat /></Layout>} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/notes" element={<Navigate to="/editor" />} />
        <Route path="/notes-list" element={<Layout><Notes /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </NotesProvider>
  );
};

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="online-note-ai-theme">
          <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20">
            <AuthProvider>
              <FoldersProvider>
                <AppRoutes />
              </FoldersProvider>
            </AuthProvider>
          </div>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
>>>>>>> noteai-suite/main
