
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
  return (
    <Card className="bg-black/40 backdrop-blur-lg border-white/10 hover:border-yellow-400/50 transition-all hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] group">
      <CardContent className="p-6 text-center">
        {/* Avatar */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-yellow-400/20">
          <img 
            src={sponsor.avatar} 
            alt={`${sponsor.name} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Sponsor Info */}
        <h4 className="text-lg font-bold text-white mb-3">{sponsor.name}</h4>
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
