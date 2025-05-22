import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "This note-taking app has completely transformed how I organize my thoughts. The seamless experience and intelligent features make it my go-to productivity tool.",
      author: "Sarah M.",
      role: "Product Manager",
      rating: 5,
    },
    {
      quote: "I've tried dozens of note apps, but this one strikes the perfect balance of simplicity and power. The AI features are actually useful rather than gimmicky.",
      author: "James K.",
      role: "Software Developer",
      rating: 5,
    },
    {
      quote: "As a student, I needed something that would help me organize my lecture notes and research. This app has exceeded my expectations with its intuitive design.",
      author: "Priya T.",
      role: "Graduate Student",
      rating: 4,
    }
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-white">
          What Users Are Saying
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Join thousands of satisfied users who have enhanced their note-taking experience with our intelligent platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="glass-panel-dark p-6 rounded-xl relative"
            >
              <Quote className="absolute top-4 right-4 h-6 w-6 text-purple-500/30" />
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                    fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
              <div className="mt-auto">
                <p className="font-medium text-white">{testimonial.author}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Testimonials;
