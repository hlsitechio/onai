
import React from 'react';
import WallOfFameHeader from './sponsors/WallOfFameHeader';
import CompanySponsorsSection from './sponsors/CompanySponsorsSection';
import IndividualSponsorsSection from './sponsors/IndividualSponsorsSection';

const SponsorsWallOfFame = () => {
  // Individual sponsors from Buy Me a Coffee and other platforms
  const individualSponsors = [
    {
      name: "Alex Johnson",
      amount: "$50",
      message: "Love this note-taking app! Keep up the great work!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      platform: "buymeacoffee",
      tier: "gold"
    },
    {
      name: "Sarah Chen",
      amount: "$25",
      message: "Amazing tool for students like me. Thank you!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      platform: "buymeacoffee",
      tier: "silver"
    },
    {
      name: "Mike Rodriguez",
      amount: "$15",
      message: "Simple and effective. Exactly what I needed!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      platform: "buymeacoffee",
      tier: "bronze"
    },
    {
      name: "Emily Davis",
      amount: "$30",
      message: "Great for organizing my thoughts and ideas!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      platform: "buymeacoffee",
      tier: "silver"
    }
  ];

  // Company sponsors with the new uploaded logos
  const companySponsors = [
    {
      name: "IONOS",
      logo: "/lovable-uploads/8c8f3a45-abfe-48f9-8d06-b704e41be46c.png",
      website: "https://ionos.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "Vercel",
      logo: "/lovable-uploads/a3e8be49-df57-474f-b816-358eeb923ca1.png",
      website: "https://vercel.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "Google Gemini",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
      website: "https://gemini.google.com",
      tier: "platinum",
      sponsorshipLevel: "$500+"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#050510] to-[#0a0a1a] overflow-hidden relative">
      {/* Local dot grid background for this section */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0A0A1B] to-[#050510]"></div>
        <svg 
          className="w-full h-full opacity-40" 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%"
        >
          <defs>
            <pattern 
              id="sponsorDotGrid" 
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
              id="sponsorDotGridLarge" 
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
          <rect width="100%" height="100%" fill="url(#sponsorDotGrid)" />
          <rect width="100%" height="100%" fill="url(#sponsorDotGridLarge)" />
        </svg>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <WallOfFameHeader />
        <CompanySponsorsSection sponsors={companySponsors} />
        <IndividualSponsorsSection sponsors={individualSponsors} />
      </div>

      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </section>
  );
};

export default SponsorsWallOfFame;
