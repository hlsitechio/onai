
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter."
      });
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0518] to-[#050510] relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative p-12 rounded-3xl bg-gradient-to-r from-noteflow-900/30 to-purple-900/30 border border-noteflow-400/20 backdrop-blur-sm">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-noteflow-600/10 to-purple-600/10 blur-xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
                Stay Updated
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Get the latest features, tips, and updates delivered to your inbox. 
                Join our community of productive writers.
              </p>

              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-6 py-4 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:border-noteflow-400 focus:ring-noteflow-400/20"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-noteflow-500/25 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    No spam, unsubscribe at any time. We respect your privacy.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">You're all set!</h3>
                    <p className="text-gray-300">Thank you for subscribing to our newsletter.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
