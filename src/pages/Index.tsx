
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TextEditor from "@/components/TextEditor";
import { useFocusMode } from "@/contexts";
import Footer from "@/components/Footer";
import FeatureShowcase from "@/components/FeatureShowcase";

const Index = () => {
  // Use focus mode context to determine visibility of elements
  const {
    isFocusMode
  } = useFocusMode();
  
  return <div className="min-h-screen flex flex-col w-screen max-w-[100vw] overflow-x-hidden">
      {/* Header and Hero use blur-in-focus-mode class instead of conditional rendering */}
      <div className="blur-in-focus-mode">
        <Header />
        <Hero />
      </div>
      
      {/* Main editor section with improved mobile spacing */}
      <div id="editor-section" className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10 max-w-[96%] lg:max-w-[94%] xl:max-w-[92%]">
        {/* Beta Test Banner - Smaller on mobile */}
        <div className="w-full max-w-[1200px] mx-auto mb-3 md:mb-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg text-center py-2 md:py-3 px-3 md:px-4">
            <span className="text-orange-300 font-medium text-xs md:text-sm">
              🧪 Beta Test - This application is currently in beta testing phase
            </span>
          </div>
        </div>
        
        {/* Minimal padding to eliminate empty space and ensure panels reach Feature Showcase */}
        <div className="mx-auto w-full py-2 md:py-3">
          <div className="w-full max-w-[1200px] mx-auto">
            <TextEditor />
          </div>
        </div>
      </div>
      
      {/* Feature showcase section - positioned immediately after editor */}
      <div className="blur-in-focus-mode hidden md:block">
        <FeatureShowcase />
      </div>
      
      {/* Compact mobile footer */}
      <div className="blur-in-focus-mode">
        <Footer />
      </div>
    </div>;
};

export default Index;
