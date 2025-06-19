
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Coffee, FileText, Zap, Settings } from 'lucide-react';
import { Github } from 'lucide-react';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  
  const openSignInModal = () => {
    setAuthModalTab('signin');
    setIsAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-noteflow-400/10 to-purple-500/10 group-hover:from-noteflow-400/20 group-hover:to-purple-500/20 transition-all duration-300">
              <img 
                src="/lovable-uploads/fccad14b-dab2-4cbe-82d9-fe30b6f82787.png" 
                alt="ONAI Logo" 
                className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent group-hover:from-noteflow-300 group-hover:to-purple-300 transition-all duration-300">
              Online Note AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link 
                  to="/ionos"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Domain Manager</span>
                </Link>
                <Separator orientation="vertical" className="h-6 bg-white/10" />
              </>
            )}
            <Link 
              to="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-use"
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Terms of Use
            </Link>
            <Separator orientation="vertical" className="h-6 bg-white/10" />
            <a 
              href="https://github.com/hlsitechio/onai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.buymeacoffee.com/onlinenoteai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span>Support Us</span>
            </a>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={openSignInModal}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openSignUpModal}
                  className="border-noteflow-400 text-noteflow-400 hover:bg-noteflow-400 hover:text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultTab={authModalTab}
      />
    </>
  );
};

export default Header;
