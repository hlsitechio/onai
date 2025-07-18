
import React from 'react';
import WallOfFameHeader from './sponsors/WallOfFameHeader';
import CompanySponsorsSection from './sponsors/CompanySponsorsSection';
import DotGridBackground from './DotGridBackground';

const SponsorsWallOfFame = () => {
  // Company sponsors with updated list - including Node.js
  const companySponsors = [
    {
      name: "IONOS",
      logo: "/lovable-uploads/8c8f3a45-abfe-48f9-8d06-b704e41be46c.png",
      website: "https://ionos.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "Supabase",
      logo: "/lovable-uploads/396406a1-7781-48ab-8f21-c0a2e4384193.png",
      website: "https://supabase.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "React",
      logo: "/lovable-uploads/15e5d185-78c3-448d-85bc-6b1a26093800.png",
      website: "https://react.dev",
      tier: "platinum",
      sponsorshipLevel: "$500+"
    },
    {
      name: "Node.js",
      logo: "/lovable-uploads/d6a1875a-07bb-4c47-8406-3df289fff970.png",
      website: "https://nodejs.org",
      tier: "platinum",
      sponsorshipLevel: "$500+"
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
