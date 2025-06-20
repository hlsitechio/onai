
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, InfoIcon, Settings, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import TextAIProcessor from "../ai-text-processor/TextAIProcessor";
import AIDisclaimer from "./AIDisclaimer";
import { getUsageStats } from "@/utils/aiUtils";

interface EnhancedAISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
}

const EnhancedAISidebar: React.FC<EnhancedAISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight
}) => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [usageStats] = useState(() => getUsageStats());
  const { toast } = useToast();
  const { user } = useAuth();

  return (
    <div className="w-full glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 h-full">
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#03010a]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-noteflow-400" />
          <h3 className="text-white font-medium">Enhanced AI Text Tools</h3>
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
          <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
            Enhanced
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#03010a]">
        <TextAIProcessor
          initialText={content}
          onTextChange={onApplyChanges}
          className="border-0 bg-transparent"
        />
        
        {/* Usage Statistics */}
        <div className="mt-6 p-3 bg-black/20 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Daily Usage</span>
            <span className="text-xs text-slate-300">{usageStats.used}/{usageStats.limit}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${usageStats.percent > 80 ? 'bg-red-500' : 'bg-noteflow-500'}`} 
              style={{ width: `${usageStats.percent}%` }}
            />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-white">✨ New AI Features</h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {[
              '🌐 Smart Translation (10 languages)',
              '✍️ Style Rewriting (7 styles)',
              '📏 Text Resizing (expand/compress)',
              '📝 Advanced Summarization',
              '🎭 Tone Modification (7 tones)',
              '⚡ Quick Actions in text selection'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-300 p-2 bg-black/10 rounded">
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AIDisclaimer isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
    </div>
  );
};

export default EnhancedAISidebar;
