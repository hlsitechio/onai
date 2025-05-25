
import React from 'react';
import { Heart, Coffee, Building2, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
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
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      platform: "buymeacoffee",
      tier: "silver"
    }
  ];

  // Company sponsors with actual logos - duplicated for continuous scrolling
  const companySponsors = [
    {
      name: "McDonald's",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png",
      website: "https://mcdonalds.com",
      tier: "platinum",
      sponsorshipLevel: "$500+"
    },
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
      name: "Microsoft",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png",
      website: "https://microsoft.com",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "Amazon",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
      website: "https://amazon.com",
      tier: "silver",
      sponsorshipLevel: "$100+"
    },
    {
      name: "Netflix",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
      website: "https://netflix.com",
      tier: "platinum",
      sponsorshipLevel: "$500+"
    }
  ];

  // Duplicate sponsors for seamless loop
  const duplicatedSponsors = [...companySponsors, ...companySponsors];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-purple-500 to-indigo-600';
      case 'gold': return 'from-yellow-400 to-orange-500';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-400 to-red-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎 Platinum';
      case 'gold': return '🥇 Gold';
      case 'silver': return '🥈 Silver';
      case 'bronze': return '🥉 Bronze';
      default: return '⭐ Supporter';
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#050510] to-[#0a0a1a] overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wall of Fame
            </h2>
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            A heartfelt thank you to our amazing sponsors who make Online Note AI possible. 
            Your support helps us keep the app free and continuously improve it for everyone.
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://buymeacoffee.com/onlinenoteai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Coffee className="h-5 w-5" />
              Buy us a coffee
            </a>
            <a 
              href="mailto:info@onlinenote.ai?subject=Sponsorship%20Inquiry"
              className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Building2 className="h-5 w-5" />
              Become a Sponsor
            </a>
          </div>
        </div>

        {/* Company Sponsors Logo Section - Horizontal Scrolling */}
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

        {/* Individual Sponsors Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-6 w-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Individual Supporters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {individualSponsors.map((sponsor, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-lg border-white/10 hover:border-yellow-400/50 transition-all hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] group">
                <CardContent className="p-6 text-center">
                  {/* Tier Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${getTierColor(sponsor.tier)} text-white`}>
                    {getTierBadge(sponsor.tier)}
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-yellow-400/20">
                    <img 
                      src={sponsor.avatar} 
                      alt={`${sponsor.name} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Sponsor Info */}
                  <h4 className="text-lg font-bold text-white mb-1">{sponsor.name}</h4>
                  <p className="text-yellow-400 font-medium mb-2">{sponsor.amount}</p>
                  <p className="text-gray-400 text-sm italic">"{sponsor.message}"</p>
                  
                  {/* Buy Me a Coffee Icon */}
                  {sponsor.platform === 'buymeacoffee' && (
                    <div className="mt-3 flex justify-center">
                      <Coffee className="h-4 w-4 text-yellow-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
