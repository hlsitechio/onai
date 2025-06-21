
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
import AIChatPanel from "../ai-chat/AIChatPanel";
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
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();

  const handleOCRTextExtracted = (text: string) => {
    onApplyChanges(content + (content.endsWith('\n') || content === '' ? '' : '\n') + text);
    toast({
      title: "OCR text inserted",
      description: "Extracted text has been added to your note."
    });
  };

  const handleApplyToEditor = (aiContent: string) => {
    const newContent = content + '\n\n' + aiContent;
    onApplyChanges(newContent);
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
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }
      console.log('Invoking stripe-checkout function...');
      const {
        data,
        error
      } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          product_id: 'prod_SOstZzMeZgtmK5',
          // Your product ID
          success_url: `${window.location.origin}/success`,
          cancel_url: window.location.href
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      console.log('Stripe checkout response:', {
        data,
        error
      });
      if (error) {
        console.error('Stripe checkout error:', error);
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
        errorMessage = error.message;
      }
      toast({
        title: "Upgrade failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 h-full">
      {/* AI Chat Panel */}
      <AIChatPanel 
        onApplyToEditor={handleApplyToEditor}
      />

      {/* AI Disclaimer Dialog */}
      <AIDisclaimer isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />

      {/* OCR Popup */}
      <OCRPopup isOpen={isOCROpen} onClose={() => setIsOCROpen(false)} onTextExtracted={handleOCRTextExtracted} />
    </div>
  );
};

export default AISidebar;
