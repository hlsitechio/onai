
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NotesSidebar from './NotesSidebar';
import NotesEditor from './NotesEditor';
import UserMenu from '@/components/UserMenu';
import { Loader2 } from 'lucide-react';

const NotesDashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Please sign in to access your notes</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] relative">
      {/* Global animated background overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 60, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 60, 120, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(60, 255, 200, 0.06) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
                Online Note AI
              </h1>
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full pt-16">
          <NotesSidebar />
          <NotesEditor />
        </div>
      </div>
    </div>
  );
};

export default NotesDashboard;
