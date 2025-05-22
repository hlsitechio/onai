
import { CheckCircle } from "lucide-react";
import AdBanner from "./AdBanner";

const Features = () => {
  const features = [
    { title: "Rich Text Editing", description: "Format your notes with bold, italic, lists, headings and more" },
    { title: "Auto Saving", description: "Your notes are automatically saved to your browser's local storage" },
    { title: "No Account Needed", description: "Start taking notes immediately without signing up" },
    { title: "Export Options", description: "Download your notes as text files whenever you need" },
    { title: "Responsive Design", description: "Use on any device - mobile, tablet, or desktop" },
    { title: "Free Forever", description: "All core features are completely free to use" }
  ];
  
  return (
    <section className="py-16 px-4 bg-black/95">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12 text-gray-200">Why Choose NoteFlow?</h2>
        
        {/* Premium Ad Banner with a specific ad slot */}
        <AdBanner size="large" className="my-8 max-w-4xl mx-auto" adSlotId="2345678901" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/40 backdrop-blur-lg p-6 rounded-lg border border-white/10 hover:border-noteflow-400/50 transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="text-noteflow-400 h-6 w-6 mt-1 flex-shrink-0" />
                <h3 className="text-xl font-medium text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400 ml-9">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
