import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="py-16 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-panel-dark rounded-xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-purple-500/10 to-blue-500/5 rounded-full blur-xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-indigo-500/10 to-blue-500/5 rounded-full blur-xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                <Mail className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated with AI-Powered Notes
            </h2>
            
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter to receive productivity tips, AI feature updates, and exclusive content to help you make the most of your note-taking experience.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="gradient-button px-5 py-2 rounded-md font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Subscribing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center justify-center text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Thank you! You've been added to our newsletter.</span>
              </div>
            )}
            
            <p className="text-gray-500 text-xs mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
