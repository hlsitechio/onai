import React, { useEffect, useState } from 'react';

interface CompanySponsor {
  name: string;
  logo: string;
  website: string;
  tier: string;
  sponsorshipLevel: string;
}

interface CompanySponsorsSectionProps {
  sponsors?: CompanySponsor[];
}

const CompanySponsorsSection: React.FC<CompanySponsorsSectionProps> = ({ sponsors = [] }) => {
  // Use the provided sponsors or fallback to our tech stack logos
  const [techLogos, setTechLogos] = useState<CompanySponsor[]>([
    {
      name: 'React',
      logo: '/assets/logos/react-logo.png',
      website: 'https://reactjs.org',
      tier: 'Platinum',
      sponsorshipLevel: 'Framework Partner'
    },
    {
      name: 'TypeScript',
      logo: '/assets/logos/typescript-logo.png',
      website: 'https://www.typescriptlang.org',
      tier: 'Gold',
      sponsorshipLevel: 'Language Partner'
    },
    {
      name: 'Next.js',
      logo: '/assets/logos/nextjs-logo.png',
      website: 'https://nextjs.org',
      tier: 'Gold',
      sponsorshipLevel: 'Framework Partner'
    },
    {
      name: 'Node.js',
      logo: '/assets/logos/nodejs-logo.png',
      website: 'https://nodejs.org',
      tier: 'Silver',
      sponsorshipLevel: 'Runtime Partner'
    },
    {
      name: 'Tailwind CSS',
      logo: '/assets/logos/tailwind-logo.png',
      website: 'https://tailwindcss.com',
      tier: 'Silver',
      sponsorshipLevel: 'Styling Partner'
    },
    {
      name: 'Vite',
      logo: '/assets/logos/vite-logo.png',
      website: 'https://vitejs.dev',
      tier: 'Silver',
      sponsorshipLevel: 'Build Tool Partner'
    },
    {
      name: 'AWS',
      logo: '/assets/logos/aws-logo.png',
      website: 'https://aws.amazon.com',
      tier: 'Platinum',
      sponsorshipLevel: 'Cloud Partner'
    }
  ]);

  // Use actual sponsors if provided, otherwise use our tech stack
  const displaySponsors = sponsors.length > 0 ? sponsors : techLogos;
  
  // Double the logos for a seamless infinite carousel effect
  const carouselLogos = [...displaySponsors, ...displaySponsors];
  
  // Automatic carousel animation speed adjustment based on number of items
  const animationDuration = `${Math.max(20, displaySponsors.length * 5)}s`;

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Technology Partners</h3>
        <p className="text-gray-400 text-sm">Built with cutting-edge technologies</p>
      </div>
      
      {/* Logo Carousel */}
      <div className="relative overflow-hidden py-8 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 rounded-xl border border-purple-800/30">
        {displaySponsors.length <= 3 ? (
          // Static centered layout for 3 or fewer sponsors
          <div className="flex justify-center items-center gap-12">
            {displaySponsors.map((sponsor, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="block group cursor-default">
                  <div className="w-40 h-20 flex items-center justify-center p-4 group-hover:scale-105 transition-all duration-300">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className="max-w-full max-h-full object-contain transition-all duration-300 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{sponsor.name}</p>
                    <p className="text-purple-400 text-xs">{sponsor.sponsorshipLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Animated carousel for multiple tech partner logos
          <div 
            className="flex hover:[animation-play-state:paused]"
            style={{
              width: 'calc(200% + 4rem)', // Account for gaps
              animation: `scroll ${animationDuration} linear infinite`,
            }}
          >
            {carouselLogos.map((sponsor, index) => (
              <div key={index} className="flex-shrink-0 mx-8">
                <a 
                  href={sponsor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group cursor-pointer"
                >
                  <div className="w-40 h-20 flex items-center justify-center p-4 group-hover:scale-110 transition-all duration-300">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className="max-w-full max-h-full object-contain transition-all duration-300 opacity-90 group-hover:opacity-100"
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
        )}
        
        {/* Disclaimer in bottom right corner */}
        <div className="absolute bottom-2 right-4">
          <p className="text-gray-500 text-xs italic">
            *Our technology stack - Showcasing the tools that power OneAI
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanySponsorsSection;
