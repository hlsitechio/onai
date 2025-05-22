
const Header = () => {
  return (
    <header className="py-4 px-4 bg-black/30 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-poppins font-semibold text-noteflow-400">Note<span className="text-gray-300">Flow</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-400 hover:text-noteflow-400 transition-colors">Features</a>
            <a href="#" className="text-gray-400 hover:text-noteflow-400 transition-colors">Templates</a>
            <a href="#" className="text-gray-400 hover:text-noteflow-400 transition-colors">About</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
