import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AIDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIDisclaimer: React.FC<AIDisclaimerProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-black/80 backdrop-blur-lg border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            AI Usage & Privacy Disclaimer
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Please review the following important information about our AI features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2 text-sm text-slate-100">
          <div className="space-y-2">
            <h3 className="text-md font-medium flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-amber-400" />
              AI Limitations
            </h3>
            <p className="text-slate-300">
              Gemini AI may occasionally produce inaccurate, misleading, or offensive content. Always review and verify AI-generated content before relying on it for important purposes. The AI system may not always understand context perfectly and can make errors in its interpretations or outputs.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-amber-400" />
              Image Processing
            </h3>
            <p className="text-slate-300">
              When processing images, our AI may misinterpret visual content or fail to identify important elements. Do not use image analysis for critical applications like medical diagnosis, safety-critical systems, or legal evidence. Images may be processed using Google's Gemini services.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Data Privacy Commitment
            </h3>
            <p className="text-slate-300">
              <strong>We do not use your notes or images to train AI models.</strong> Your content remains private and is not retained beyond the processing necessary to provide the requested AI features. All notes are automatically deleted after 24 hours as part of our privacy-first approach.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Usage Limits
            </h3>
            <p className="text-slate-300">
              We provide generous AI usage allowances for free users. If you require additional capacity, please contact us. We continually monitor usage patterns to ensure availability for all users while maintaining performance and quality.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
          >
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIDisclaimer;
