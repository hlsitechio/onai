import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
interface NotesActionsProps {
  onShare: () => void;
  content?: string;
}
const NotesActions: React.FC<NotesActionsProps> = ({
  onShare,
  content
}) => {
  return <div style={{
    animationDelay: '0.1s'
  }} className="p-4 border-t border-white/10 animate-slideUp bg-[#03010a]">
      <Button variant="ghost" size="sm" className="w-full text-left justify-start text-white hover:bg-white/10 group relative overflow-hidden" onClick={onShare} disabled={!content?.trim()}>
        <div className="absolute inset-0 bg-noteflow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-1 mr-2 bg-noteflow-500/20 rounded-full group-hover:bg-noteflow-500/30 transition-colors duration-300">
          <ArrowRight className="h-3.5 w-3.5 text-noteflow-400 group-hover:translate-x-0.5 transition-transform duration-300" />
        </div>
        <span className="relative">Share Current Note</span>
        <Sparkles className="h-3.5 w-3.5 text-noteflow-400 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    </div>;
};
export default NotesActions;