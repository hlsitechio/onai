
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TextEditor from "@/components/TextEditor";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,30,50,0.3)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      <Header />
      <Hero />
      
      {/* Main editor section with improved visibility */}
      <div id="editor-section" className="container mx-auto px-4 my-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Your Notes, <span className="text-noteflow-400">Enhanced</span>
          </h2>
          
          {/* In-article ad format before the editor */}
          <AdBanner 
            size="medium" 
            format="in-article" 
            adSlotId="6157600223" 
            className="my-6"
          />
          
          <TextEditor />
        </div>
      </div>
      
      {/* Autorelaxed ad format after the editor */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner 
          size="large" 
          format="autorelaxed" 
          adSlotId="9905273540" 
          className="my-8"
        />
      </div>
      
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
