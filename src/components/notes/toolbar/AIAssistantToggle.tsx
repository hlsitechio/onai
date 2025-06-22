
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantToggleProps {
  aiPanelOpen: boolean;
  onToggleAIPanel: () => void;
}

const AIAssistantToggle: React.FC<AIAssistantToggleProps> = ({ aiPanelOpen, onToggleAIPanel }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleAIPanel}
      className={cn(
        "h-10 px-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg border border-transparent flex items-center gap-2",
        aiPanelOpen && "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10"
      )}
    >
      <Sparkles className={cn("h-4 w-4", aiPanelOpen && "animate-pulse")} />
      <span className="text-sm font-medium">AI Assistant</span>
    </Button>
  );
};

export default AIAssistantToggle;
