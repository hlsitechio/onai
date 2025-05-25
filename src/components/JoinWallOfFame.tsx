
import React from 'react';
import { Star, Coffee, Building2 } from 'lucide-react';

const JoinWallOfFame = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#0a0a1a] to-[#050510] relative overflow-hidden">
      {/* Local dot grid background for this section */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0A0A1B] to-[#050510]"></div>
        <svg 
          className="w-full h-full opacity-40" 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%"
        >
          <defs>
            <pattern 
              id="joinDotGrid" 
              width="30" 
              height="30" 
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="15" 
                cy="15" 
                r="1.5" 
                fill="rgba(120, 90, 220, 0.8)" 
              />
            </pattern>
            <pattern 
              id="joinDotGridLarge" 
              width="80" 
              height="80" 
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="40" 
                cy="40" 
                r="2" 
                fill="rgba(150, 120, 255, 0.6)" 
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#joinDotGrid)" />
          <rect width="100%" height="100%" fill="url(#joinDotGridLarge)" />
        </svg>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-400/20">
          <Star className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Join Our Wall of Fame!</h3>
          <p className="text-gray-300 mb-6">
            Your support helps us maintain and improve Online Note AI for everyone. 
            Every contribution, no matter the size, makes a difference!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://buymeacoffee.com/onlinenoteai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Coffee className="h-5 w-5" />
              Support Us
            </a>
            <a 
              href="mailto:info@onlinenote.ai"
              className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Building2 className="h-5 w-5" />
              Corporate Partnership
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinWallOfFame;
