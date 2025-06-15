
import React from 'react';
import { Users } from 'lucide-react';
import IndividualSponsorCard from './sponsors/IndividualSponsorCard';
import DotGridBackground from './DotGridBackground';

const IndividualSupportersSection = () => {
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

  return (
    <section className="py-16 px-4 bg-black overflow-hidden relative">
      {/* Use the same DotGridBackground component */}
      <DotGridBackground />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Users className="h-6 w-6 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Individual Supporters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {individualSponsors.map((sponsor, index) => (
            <IndividualSponsorCard key={index} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndividualSupportersSection;
