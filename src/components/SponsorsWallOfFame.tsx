
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

  // Company sponsors
  const companySponsors = [
    {
      name: "TechFlow Solutions",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop",
      website: "https://techflow.com",
      description: "Leading digital transformation consultancy helping businesses modernize their operations.",
      tier: "platinum",
      sponsorshipLevel: "$500+"
    },
    {
      name: "CloudNext Inc",
      logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=100&fit=crop",
      website: "https://cloudnext.com",
      description: "Cloud infrastructure and software development company focused on scalable solutions.",
      tier: "gold",
      sponsorshipLevel: "$250+"
    },
    {
      name: "DevTools Pro",
      logo: "https://images.unsplash.com/photo-1553028826-f4804151e606?w=200&h=100&fit=crop",
      website: "https://devtools.pro",
      description: "Professional development tools and resources for modern software teams.",
      tier: "silver",
      sponsorshipLevel: "$100+"
    }
  ];

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
    <section className="py-16 px-4 bg-gradient-to-b from-[#050510] to-[#0a0a1a]">
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

        {/* Company Sponsors Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-6 w-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Company Sponsors</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companySponsors.map((sponsor, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-lg border-white/10 hover:border-purple-400/50 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] group">
                <CardContent className="p-6">
                  {/* Tier Badge */}
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${getTierColor(sponsor.tier)} text-white`}>
                    {getTierBadge(sponsor.tier)}
                  </div>
                  
                  {/* Company Logo */}
                  <div className="w-full h-24 bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className="max-w-full max-h-full object-contain p-2"
                    />
                  </div>
                  
                  {/* Company Info */}
                  <h4 className="text-xl font-bold text-white mb-2">{sponsor.name}</h4>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{sponsor.description}</p>
                  
                  {/* Sponsorship Level */}
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-medium text-sm">{sponsor.sponsorshipLevel}</span>
                    <a 
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium group-hover:underline"
                    >
                      Visit Website →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
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

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-400/20">
          <Star className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Join Our Wall of Fame!</h3>
          <p className="text-gray-300 mb-6">
            Your support helps us maintain and improve Online Note AI for everyone. 
            Every contribution, no matter the size, makes a difference!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://buymeacoffee.com/onlinenoteai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Coffee className="h-5 w-5" />
              Support Us
            </a>
            <a 
              href="mailto:info@onlinenote.ai?subject=Corporate%20Sponsorship"
              className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Building2 className="h-5 w-5" />
              Corporate Partnership
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsWallOfFame;
