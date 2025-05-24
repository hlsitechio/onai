
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TextEditor from "@/components/TextEditor";
import { useFocusMode } from "@/contexts";
import Footer from "@/components/Footer";
import EzoicAdBanner from "@/components/EzoicAdBanner";
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
      
      {/* Main editor section with improved visibility - removed vertical margins */}
      <div id="editor-section" className="container mx-auto px-2 sm:px-3 md:px-4 relative z-10 max-w-[96%] lg:max-w-[94%] xl:max-w-[92%]">
        {/* Beta Test Banner */}
        <div className="w-full max-w-[1200px] mx-auto mb-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg text-center py-[10px] px-[14px]">
            <span className="text-orange-300 font-medium text-sm">
              🧪 Beta Test - This application is currently in beta testing phase
            </span>
          </div>
        </div>
        
        <div className="mx-auto w-full py-[57px]">
          {/* Removed heading to eliminate separation */}
          <div className="w-full max-w-[1200px] mx-auto">
            <TextEditor />
          </div>
        </div>
      </div>
      
      {/* Feature showcase section */}
      <div className="blur-in-focus-mode">
        <FeatureShowcase />
      </div>
      
      {/* Optimized ad placement between sections */}
      {/* Hide ad banner in focus mode */}
      {!isFocusMode && <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <EzoicAdBanner size="small" placeholderId={100} adName="top_of_page" className="my-4" />
          </div>
        </div>}
      
      {/* No newsletter section as requested */}
      
      {/* Optimized ad placement before footer */}
      <div className="blur-in-focus-mode">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center">
              <EzoicAdBanner size="medium" placeholderId={101} adName="bottom_of_page" className="mx-auto" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="blur-in-focus-mode">
        <Footer />
      </div>
    </div>;
};

export default Index;
