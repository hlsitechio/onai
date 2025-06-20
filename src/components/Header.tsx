
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isLandingPage = location.pathname === '/landing';

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Full Experience', href: '/landing' },
    { name: 'Features', href: isLandingPage ? '#features' : '/#features' },
    { name: 'Pricing', href: isLandingPage ? '#pricing' : '/#pricing' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-noteflow-400 group-hover:text-noteflow-300 transition-colors" />
              <div className="absolute inset-0 animate-pulse">
                <Sparkles className="h-8 w-8 text-noteflow-400/50" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent">
              Online Note AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-noteflow-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link to="/app">
                <Button className="bg-noteflow-600 hover:bg-noteflow-500 text-white">
                  Go to App
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-noteflow-600 hover:bg-noteflow-500 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/40 backdrop-blur-lg border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  {user ? (
                    <Link to="/app" className="block">
                      <Button className="w-full bg-noteflow-600 hover:bg-noteflow-500 text-white">
                        Go to App
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth" className="block">
                        <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth" className="block">
                        <Button className="w-full bg-noteflow-600 hover:bg-noteflow-500 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
