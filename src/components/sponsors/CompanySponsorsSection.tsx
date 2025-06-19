
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            duration: 15,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 0,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              playOnInit: true,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {/* Duplicate sponsors array for seamless infinite loop */}
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group cursor-pointer"
                  >
                    <div className={`flex items-center justify-center p-6 group-hover:scale-110 transition-all duration-500 ease-out ${
                      sponsor.name === 'Supabase' ? 'w-full h-32' : 'w-full h-28'
                    }`}>
                      <img 
                        src={sponsor.logo} 
                        alt={`${sponsor.name} logo`}
                        className={`max-w-full max-h-full object-contain transition-all duration-500 ease-out opacity-80 group-hover:opacity-100 ${
                          sponsor.name === 'React' 
                            ? 'w-24 h-24 drop-shadow-lg' // Even larger size for React with shadow
                            : sponsor.name === 'Supabase' || sponsor.name === 'Node.js'
                            ? 'drop-shadow-sm' // Add subtle shadow to colored logos
                            : 'filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 drop-shadow-sm'
                        }`}
                      />
                    </div>
                    <div className="text-center mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <p className="text-white text-base font-medium">{sponsor.name}</p>
                      <p className="text-purple-400 text-sm">{sponsor.sponsorshipLevel}</p>
                    </div>
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default CompanySponsorsSection;
