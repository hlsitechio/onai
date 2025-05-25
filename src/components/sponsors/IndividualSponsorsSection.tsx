
import React from 'react';
import { Users } from 'lucide-react';
import IndividualSponsorCard from './IndividualSponsorCard';

interface IndividualSponsor {
  name: string;
  amount: string;
  message: string;
  avatar: string;
  platform: string;
  tier: string;
}

interface IndividualSponsorsSectionProps {
  sponsors: IndividualSponsor[];
}

const IndividualSponsorsSection: React.FC<IndividualSponsorsSectionProps> = ({ sponsors }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-6 w-6 text-yellow-400" />
        <h3 className="text-2xl font-bold text-white">Individual Supporters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sponsors.map((sponsor, index) => (
          <IndividualSponsorCard key={index} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
};

export default IndividualSponsorsSection;
