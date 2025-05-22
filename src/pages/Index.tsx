
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TextEditor from "@/components/TextEditor";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import HowItWorks from "@/components/HowItWorks";
import NewsletterSection from "@/components/NewsletterSection";
import AIFeatures from "@/components/AIFeatures";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Enhanced background with multiple gradients for depth and sophistication */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#070B34] via-[#141E4A] to-[#07051A] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,90,220,0.15)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(60,20,180,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,80,0.2)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"></div>
      <div className="fixed inset-0 opacity-5 mix-blend-overlay pointer-events-none">
        <img src="/lovable-uploads/background.png" alt="Background Texture" className="object-cover w-full h-full" />
      </div>
      <Header />
      <Hero />
      
      {/* Main editor section with improved visibility */}
      <div id="editor-section" className="container mx-auto px-4 my-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center tracking-tight">
            Your Notes, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">Enhanced</span>
          </h2>
          
          <div className="w-full max-w-[1200px] mx-auto">
            <TextEditor />
          </div>
        </div>
      </div>
      
      {/* Combined How It Works and AI Features sections */}
      <HowItWorks />
      <AIFeatures />
      
      {/* Optimized ad placement between sections */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <AdBanner 
            size="small" 
            format="horizontal" 
            adSlotId="9905273540" 
            className="my-4"
          />
        </div>
      </div>
      
      {/* Newsletter subscription section */}
      <NewsletterSection />
      
      {/* Optimized ad placement before footer - native format */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center">
            <AdBanner 
              size="medium" 
              format="rectangle" 
              adSlotId="2589674531" 
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
