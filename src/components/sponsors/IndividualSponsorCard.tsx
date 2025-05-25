
import React from 'react';
import { Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface IndividualSponsorCardProps {
  sponsor: {
    name: string;
    amount: string;
    message: string;
    avatar: string;
    platform: string;
    tier: string;
  };
}

const IndividualSponsorCard: React.FC<IndividualSponsorCardProps> = ({ sponsor }) => {
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
    <Card className="bg-black/40 backdrop-blur-lg border-white/10 hover:border-yellow-400/50 transition-all hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] group">
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
  );
};

export default IndividualSponsorCard;
