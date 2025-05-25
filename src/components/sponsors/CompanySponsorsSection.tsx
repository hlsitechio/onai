
import React from 'react';

interface CompanySponsor {
  name: string;
  logo: string;
  website: string;
  tier: string;
  sponsorshipLevel: string;
}

interface CompanySponsorsSectionProps {
  sponsors: CompanySponsor[];
}

const CompanySponsorsSection: React.FC<CompanySponsorsSectionProps> = ({ sponsors }) => {
  // Duplicate sponsors for seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Meet Our Sponsors</h3>
        <p className="text-gray-400 text-sm">Trusted by leading companies worldwide</p>
      </div>
      
      {/* Auto-scrolling Logo Container - No borders */}
      <div className="relative overflow-hidden py-8">
        <div 
          className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]"
          style={{
            width: 'calc(200% + 4rem)', // Account for gaps
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <div key={index} className="flex-shrink-0 mx-8">
              <a 
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="w-40 h-20 flex items-center justify-center p-4 group-hover:scale-105 transition-all duration-300">
                  <img 
                    src={sponsor.logo} 
                    alt={`${sponsor.name} logo`}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  />
                </div>
                <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{sponsor.name}</p>
                  <p className="text-purple-400 text-xs">{sponsor.sponsorshipLevel}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
        
        {/* Disclaimer in bottom right corner */}
        <div className="absolute bottom-2 right-4">
          <p className="text-gray-500 text-xs italic">
            *These are example logos only - Real sponsors will appear here once we have partnerships
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanySponsorsSection;
