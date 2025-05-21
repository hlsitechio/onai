
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="py-4 px-4 bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-poppins font-semibold text-noteflow-600">Note<span className="text-slate-800">Flow</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-noteflow-600">Features</a>
            <a href="#" className="text-slate-600 hover:text-noteflow-600">Templates</a>
            <a href="#" className="text-slate-600 hover:text-noteflow-600">About</a>
          </div>
          
          <div>
            <Button variant="outline" className="border-noteflow-500 text-noteflow-500 hover:bg-noteflow-50">
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
