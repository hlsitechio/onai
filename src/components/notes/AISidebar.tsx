
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, InfoIcon, AlertTriangle, ShieldCheck, Clock, Bot, ExternalLink, Crown, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AIDisclaimer from "./AIDisclaimer";
import OCRButton from "../ocr/OCRButton";
import OCRPopup from "../ocr/OCRPopup";
import { getUsageStats } from "@/utils/aiUtils";

interface AISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
}

const AISidebar: React.FC<AISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight
}) => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [usageStats] = useState(() => getUsageStats());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleOCRTextExtracted = (text: string) => {
    onApplyChanges(content + (content.endsWith('\n') || content === '' ? '' : '\n') + text);
    toast({
      title: "OCR text inserted",
      description: "Extracted text has been added to your note."
    });
  };

  const handleUpgradeToPro = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade to Pro.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      console.log('Invoking stripe-checkout function...');

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: 'price_1QUzaDF4QdBZ7yYeVqB9KRxA', // Pro plan price ID
          success_url: `${window.location.origin}/success`,
          cancel_url: window.location.href,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Stripe checkout response:', { data, error });

      if (error) {
        console.error('Stripe checkout error:', error);
        
        // Check if it's a configuration issue
        if (error.message?.includes('Failed to fetch') || error.message?.includes('STRIPE_SECRET_KEY')) {
          toast({
            title: "Configuration needed",
            description: "Stripe integration needs to be configured. Please set up your Stripe secret key in the project settings.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }

      if (data?.url) {
        console.log('Opening Stripe checkout URL:', data.url);
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: "Opening Stripe checkout in a new tab..."
        });
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      
      let errorMessage = "There was an error processing your upgrade. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Unable to connect to payment service. Please check your internet connection and try again.";
        } else if (error.message.includes('STRIPE_SECRET_KEY')) {
          errorMessage = "Payment service is not configured. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Upgrade failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 h-full">
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#03010a]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-noteflow-400" />
          <h3 className="text-white font-medium">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10" 
            onClick={() => setIsDisclaimerOpen(true)} 
            title="AI Usage & Privacy Information"
          >
            <InfoIcon className="h-3.5 w-3.5 text-slate-300" />
          </Button>
          <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">Free</Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto bg-[#03010a]">
        {/* Usage info with privacy badge */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-300">Privacy Protected</span>
            </div>
            <span className="text-xs text-slate-400">{usageStats.used} requests today</span>
          </div>
          
          <div className="flex items-center text-xs space-x-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span className="text-xs text-amber-300/80">AI may produce inaccurate content</span>
          </div>
        </div>

        {/* Upgrade to Pro Section */}
        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Upgrade to Professional
              </h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Get 500 AI requests per day, advanced features, and priority support for just $9.99/month.
              </p>
              <Button
                onClick={handleUpgradeToPro}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs py-2"
                size="sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="h-3 w-3 mr-2" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* New AI Command Center Notice */}
        <div className="p-4 bg-gradient-to-r from-noteflow-500/20 to-blue-500/20 rounded-lg border border-noteflow-500/30">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-noteflow-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Enhanced AI Command Center
              </h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Experience our new unified AI interface! Select text in the editor or use Ctrl+Shift+A to access quick actions, smart suggestions, and advanced processing.
              </p>
              <div className="flex items-center gap-2 text-xs text-noteflow-300">
                <ExternalLink className="h-3 w-3" />
                <span>Try selecting text in the editor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Quick Tools</h4>
          
          {/* OCR Access */}
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <div className="text-sm text-white">Extract Text from Image</div>
            </div>
            <OCRButton 
              onClick={() => setIsOCROpen(true)} 
              variant="outline" 
              className="border-noteflow-500/30 bg-noteflow-500/10 text-noteflow-300 hover:bg-noteflow-500/20" 
            />
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-3 bg-black/20 rounded-lg border border-white/10">
            <h5 className="text-xs font-medium text-slate-300 mb-2">Keyboard Shortcuts</h5>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Open AI Command Center</span>
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Ctrl+Shift+A</kbd>
              </div>
              <div className="flex justify-between">
                <span>Close AI panels</span>
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Available AI Features</h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {[
              'Smart text enhancement',
              'Content expansion',
              'Writing improvement', 
              'Multi-language translation',
              'Content summarization',
              'Intelligent suggestions'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-300">
                <div className="w-1 h-1 bg-noteflow-400 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* AI Disclaimer Dialog */}
      <AIDisclaimer isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />

      {/* OCR Popup */}
      <OCRPopup isOpen={isOCROpen} onClose={() => setIsOCROpen(false)} onTextExtracted={handleOCRTextExtracted} />
    </div>
  );
};

export default AISidebar;
