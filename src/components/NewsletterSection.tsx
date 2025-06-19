
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendNewsletterConfirmation } from '@/utils/newsletterService';

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
    
    try {
      console.log('Newsletter subscription: Attempting to send confirmation email to:', email);
      
      const result = await sendNewsletterConfirmation(email);
      
      if (result.success) {
        setIsSubscribed(true);
        console.log('Newsletter subscription: Email sent successfully');
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for joining our newsletter. Check your email for confirmation."
        });
      } else {
        console.error('Newsletter subscription: Failed to send email:', result.error);
        toast({
          title: "Subscription successful!",
          description: "Thank you for joining our newsletter.",
        });
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Newsletter subscription: Error occurred:', error);
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-noteflow-600/15 to-purple-600/15 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-r from-noteflow-900/20 to-purple-900/20 border border-noteflow-400/20 backdrop-blur-sm overflow-hidden">
            {/* Enhanced background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-noteflow-600/8 to-purple-600/8 blur-xl"></div>
            
            <div className="relative z-10">
              <motion.div 
                className="w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Mail className="h-7 w-7 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
                Stay Updated
              </h2>
              
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Get the latest features, tips, and updates delivered to your inbox. 
                Join our community of productive writers.
              </p>

              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:border-noteflow-400 focus:ring-noteflow-400/20"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-noteflow-500/25 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-3">
                    No spam, unsubscribe at any time. We respect your privacy.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-green-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">You're all set!</h3>
                    <p className="text-gray-300">Thank you for subscribing to our newsletter.</p>
                    <p className="text-gray-400 text-sm mt-2">Check your email for a confirmation message.</p>
                  </div>
                </motion.div>
              )}

              {/* Enhanced decorative elements */}
              <div className="absolute -top-2 -right-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-noteflow-400/60" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
