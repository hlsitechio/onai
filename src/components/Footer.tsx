
import AdBanner from "./AdBanner";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} NoteFlow. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-sm transition-colors">Contact</a>
          </div>
        </div>
        
        {/* Footer ad with a specific ad slot */}
        <div className="mt-8">
          <AdBanner size="small" position="footer" adSlotId="1234567890" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
