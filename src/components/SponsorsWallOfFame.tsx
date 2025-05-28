
import React from 'react';
import WallOfFameHeader from './sponsors/WallOfFameHeader';
import CompanySponsorsSection from './sponsors/CompanySponsorsSection';
import IndividualSponsorsSection from './sponsors/IndividualSponsorsSection';
import LocalDotGridBackground from './sponsors/LocalDotGridBackground';

const SponsorsWallOfFame = () => {
  // Individual sponsors from Buy Me a Coffee and other platforms
  const individualSponsors = [
    {
      name: "Alex Johnson",
      amount: "$50",
      message: "Love this note-taking app! Keep up the great work!",
      avatar: "/assets/placeholders/avatars/avatar-placeholder.svg",
      platform: "buymeacoffee",
      tier: "gold"
    },
    {
      name: "Sarah Chen",
      amount: "$25",
      message: "Amazing tool for students like me. Thank you!",
      avatar: "/assets/placeholders/avatars/avatar-placeholder.svg",
      platform: "buymeacoffee",
      tier: "silver"
    },
    {
      name: "Mike Rodriguez",
      amount: "$15",
      message: "Simple and effective. Exactly what I needed!",
      avatar: "/assets/placeholders/avatars/avatar-placeholder.svg",
      platform: "buymeacoffee",
      tier: "bronze"
    },
    {
      name: "Emily Davis",
      amount: "$30",
      message: "Great for organizing my thoughts and ideas!",
      avatar: "/assets/placeholders/avatars/avatar-placeholder.svg",
      platform: "buymeacoffee",
      tier: "silver"
    }
  ];

  // Company sponsors with local placeholder logos
  const companySponsors = [
    {
      name: "Google",
      logo: "/assets/placeholders/sponsors/company-placeholder.svg",
      website: "https://google.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "Apple",
      logo: "/assets/placeholders/sponsors/company-placeholder.svg",
      website: "https://apple.com",
      tier: "silver",
      sponsorshipLevel: "$100+"
    },
    {
      name: "Amazon",
      logo: "/assets/placeholders/sponsors/company-placeholder.svg",
      website: "https://amazon.com",
      tier: "silver",
      sponsorshipLevel: "$100+"
    }
  ];

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Local dot grid background */}
      <LocalDotGridBackground />
      
      {/* Content container with proper z-index */}
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
