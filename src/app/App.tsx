
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Import the old dashboard for now (will be replaced)
import NotesDashboard from '@/components/dashboard-old/NotesDashboard';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/pages/AuthPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<NotesDashboard />} />
            <Route path="/notes" element={<NotesDashboard />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
