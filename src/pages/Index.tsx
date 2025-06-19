
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureShowcase from '@/components/FeatureShowcase';
import InteractiveFeatureShowcase from '@/components/features/InteractiveFeatureShowcase';
import Features from '@/components/Features';
import EnhancedFeatures from '@/components/EnhancedFeatures';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import SponsorsWallOfFame from '@/components/SponsorsWallOfFame';
import PricingSection from '@/components/PricingSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import NotesEditor from '@/components/notes/NotesEditor';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to the app
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />
      <Hero />
      <InteractiveFeatureShowcase />
      <div id="editor-section">
        <NotesEditor />
      </div>
      <FeatureShowcase />
      <Features />
      <EnhancedFeatures />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <SponsorsWallOfFame />
      <PricingSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
