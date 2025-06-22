
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If user is authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/fccad14b-dab2-4cbe-82d9-fe30b6f82787.png" 
              alt="ONAI Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
              Online Note AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-white hover:bg-white/10"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-noteflow-500 to-purple-500 hover:from-noteflow-600 hover:to-purple-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Smart Notes with
            <span className="block bg-gradient-to-r from-noteflow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Power
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your note-taking experience with AI-powered assistance. 
            Create, organize, and enhance your thoughts with intelligent features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-noteflow-500 to-purple-500 hover:from-noteflow-600 hover:to-purple-600 text-lg px-8 py-4"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Writing
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <FileText className="h-12 w-12 text-noteflow-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Smart Editor</h3>
              <p className="text-gray-300">
                Rich text editing with AI-powered suggestions and formatting assistance.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Zap className="h-12 w-12 text-purple-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">AI Assistant</h3>
              <p className="text-gray-300">
                Get help with writing, summarizing, and organizing your thoughts.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Shield className="h-12 w-12 text-pink-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Secure & Private</h3>
              <p className="text-gray-300">
                Your notes are encrypted and stored securely with complete privacy.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Online Note AI. Ready for your new dashboard integration.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
