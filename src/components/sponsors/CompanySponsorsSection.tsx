
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
  // Only duplicate if we have more than 3 sponsors to avoid obvious repetition
  const displaySponsors = sponsors.length > 3 ? [...sponsors, ...sponsors] : sponsors;

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Technologies</h3>
        <p className="text-gray-400 text-sm">Powered by industry-leading technologies</p>
      </div>
      
      {/* Logo Container - Static layout for few sponsors */}
      <div className="relative overflow-hidden py-8">
        {sponsors.length <= 3 ? (
          // Static centered layout for 3 or fewer sponsors
          <div className="flex justify-center items-center gap-16">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="flex-shrink-0">
                <a 
                  href={sponsor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group cursor-pointer"
                >
                  <div className={`flex items-center justify-center p-6 group-hover:scale-105 transition-all duration-300 ${
                    sponsor.name === 'Supabase' ? 'w-64 h-32' : 'w-56 h-28'
                  }`}>
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className={`max-w-full max-h-full object-contain transition-all duration-300 opacity-70 group-hover:opacity-100 ${
                        sponsor.name === 'Supabase' 
                          ? '' // Supabase logo is already white, no filter needed
                          : 'filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0'
                      }`}
                    />
                  </div>
                  <div className="text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-base font-medium">{sponsor.name}</p>
                    <p className="text-purple-400 text-sm">{sponsor.sponsorshipLevel}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          // Scrolling layout for more sponsors
          <div 
            className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]"
            style={{
              width: 'calc(200% + 4rem)', // Account for gaps
            }}
          >
            {displaySponsors.map((sponsor, index) => (
              <div key={index} className="flex-shrink-0 mx-10">
                <a 
                  href={sponsor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group cursor-pointer"
                >
                  <div className={`flex items-center justify-center p-6 group-hover:scale-105 transition-all duration-300 ${
                    sponsor.name === 'Supabase' ? 'w-64 h-32' : 'w-56 h-28'
                  }`}>
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className={`max-w-full max-h-full object-contain transition-all duration-300 opacity-70 group-hover:opacity-100 ${
                        sponsor.name === 'Supabase' 
                          ? '' // Supabase logo is already white, no filter needed
                          : 'filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0'
                      }`}
                    />
                  </div>
                  <div className="text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-base font-medium">{sponsor.name}</p>
                    <p className="text-purple-400 text-sm">{sponsor.sponsorshipLevel}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySponsorsSection;
