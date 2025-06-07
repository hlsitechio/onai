
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,30,50,0.3)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-lg bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 p-8 shadow-lg">
          <h1 className="text-6xl font-bold text-noteflow-400 mb-4">404</h1>
          <p className="text-xl text-white mb-6">Oops! This page doesn't exist</p>
          <a href="/" className="inline-block bg-noteflow-500 text-white px-6 py-3 rounded-lg hover:bg-noteflow-600 transition-colors">
            Return to Home
          </a>
          
          {/* Removed manual ad placement - Ezoic will auto-insert */}
        </div>
      </div>
      
      {/* Removed manual ad placement - Ezoic will auto-insert */}
    </div>
  );
};

export default NotFound;
