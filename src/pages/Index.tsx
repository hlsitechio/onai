
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SponsorsWallOfFame from '@/components/SponsorsWallOfFame';
import EnhancedFeatures from '@/components/EnhancedFeatures';
import PricingSection from '@/components/PricingSection';
import SitemapSection from '@/components/SitemapSection';
import Footer from '@/components/Footer';
import NotesEditor from '@/components/notes/NotesEditor';
import ScrollToTop from '@/components/ScrollToTop';
import { useEnhancedAuthContext } from '@/contexts/EnhancedAuthContext';

const Index = () => {
  const { user } = useEnhancedAuthContext();
  const navigate = useNavigate();

  // Redirect authenticated users to the app
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020010] via-[#050520] to-[#0a0518] overflow-x-hidden">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(circle at 25% 60%, rgba(120, 60, 255, 0.12) 0%, transparent 45%),
              radial-gradient(circle at 75% 30%, rgba(255, 60, 120, 0.1) 0%, transparent 45%),
              radial-gradient(circle at 45% 85%, rgba(60, 255, 200, 0.08) 0%, transparent 45%)
            `
          }}
        />
      </div>
      
      <div className="relative z-10">
        <Header />
        <Hero />
        <div id="editor-section">
          <NotesEditor />
        </div>
        <SponsorsWallOfFame />
        <EnhancedFeatures />
        <PricingSection />
        <SitemapSection />
        <Footer />
      </div>
      
      <ScrollToTop />
    </div>
  );
};

export default Index;
