
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="relative z-10 w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">NoteFlow</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>
          <a 
            href="#" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-sm py-4 md:hidden">
          <nav className="container mx-auto px-4">
            <ul className="space-y-4">
              <li><a href="#features" className="block text-white/80 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="block text-white/80 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="block text-white/80 hover:text-white transition-colors">Contact</a></li>
            </ul>
            <a 
              href="#" 
              className="block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-center"
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
