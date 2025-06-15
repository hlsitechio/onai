
import React from 'react';
import WallOfFameHeader from './sponsors/WallOfFameHeader';
import CompanySponsorsSection from './sponsors/CompanySponsorsSection';
import DotGridBackground from './DotGridBackground';

const SponsorsWallOfFame = () => {
  // Company sponsors with updated list - removed Next.js and Framer, added Framer Motion
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
    },
    {
      name: "Framer Motion",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg",
      website: "https://www.framer.com/motion/",
      tier: "gold",
      sponsorshipLevel: "$250+"
    }
  ];

  return (
    <section className="py-16 px-4 bg-black overflow-hidden relative">
      {/* Use the same DotGridBackground component */}
      <DotGridBackground />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <CompanySponsorsSection sponsors={companySponsors} />
      </div>
    </section>
  );
};

export default SponsorsWallOfFame;
