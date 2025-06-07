
import React from 'react';
import { Heart, Coffee, Building2 } from 'lucide-react';

const WallOfFameHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Heart className="h-8 w-8 text-red-500 animate-pulse" />
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Wall of Fame
        </h2>
        <Heart className="h-8 w-8 text-red-500 animate-pulse" />
      </div>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
        A heartfelt thank you to our amazing sponsors who make Online Note AI possible. 
        Your support helps us keep the app free and continuously improve it for everyone.
      </p>
      
      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a 
          href="https://buymeacoffee.com/onlinenoteai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
        >
          <Coffee className="h-5 w-5" />
          Buy us a coffee
        </a>
        <a 
          href="mailto:info@onlinenote.ai?subject=Sponsorship%20Inquiry"
          className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
        >
          <Building2 className="h-5 w-5" />
          Become a Sponsor
        </a>
      </div>
    </div>
  );
};

export default WallOfFameHeader;
