
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
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      platform: "buymeacoffee",
      tier: "silver"
    }
  ];

  // Company sponsors with actual logos
  const companySponsors = [
    {
      name: "Google",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png",
      website: "https://google.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "Apple",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
      website: "https://apple.com",
      tier: "silver",
      sponsorshipLevel: "$100+"
    },
    {
      name: "Amazon",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
      website: "https://amazon.com",
      tier: "silver",
      sponsorshipLevel: "$100+"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#050510] to-[#0a0a1a] overflow-hidden">
      <div className="container mx-auto max-w-6xl">
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
