
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CompanySponsor {
  name: string;
  logo: string;
  website: string;
  tier: string;
  sponsorshipLevel: string;
}

interface CompanySponsorsSectionProps {
  sponsors: CompanySponsor[];
}

const CompanySponsorsSection: React.FC<CompanySponsorsSectionProps> = ({ sponsors }) => {
  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Technologies</h3>
        <p className="text-gray-400 text-sm">Powered by industry-leading technologies</p>
      </div>
      
      {/* Carousel Container */}
      <div className="relative px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sponsors.map((sponsor, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group cursor-pointer"
                  >
                    <div className={`flex items-center justify-center p-6 group-hover:scale-105 transition-all duration-300 ${
                      sponsor.name === 'Supabase' ? 'w-full h-32' : 'w-full h-28'
                    }`}>
                      <img 
                        src={sponsor.logo} 
                        alt={`${sponsor.name} logo`}
                        className={`max-w-full max-h-full object-contain transition-all duration-300 opacity-70 group-hover:opacity-100 ${
                          sponsor.name === 'Supabase' || sponsor.name === 'Node.js'
                            ? '' // Supabase and Node.js logos are already appropriate colors, no filter needed
                            : 'filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0'
                        }`}
                      />
                    </div>
                    <div className="text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-base font-medium">{sponsor.name}</p>
                      <p className="text-purple-400 text-sm">{sponsor.sponsorshipLevel}</p>
                    </div>
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white border-white/20 hover:bg-white/10" />
          <CarouselNext className="text-white border-white/20 hover:bg-white/10" />
        </Carousel>
      </div>
    </div>
  );
};

export default CompanySponsorsSection;
