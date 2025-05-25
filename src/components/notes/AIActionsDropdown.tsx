
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  ChevronUp,
  Bot,
  Wand2,
  FileText,
  MessageSquare,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIActionsDropdownProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
}

const AIActionsDropdown: React.FC<AIActionsDropdownProps> = ({ 
  content, 
  onApplyChanges
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAIAction = (action: string) => {
    console.log(`AI Action triggered: ${action}`, { content });
    // These will be implemented to trigger the original AI agent functionality
    setIsOpen(false);
  };

  return (
    <div className="relative z-[9999]">
      {/* AI Actions Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-1.5 md:p-2 transition-all duration-200",
          isOpen 
            ? "text-noteflow-300 bg-noteflow-500/20 hover:bg-noteflow-500/30" 
            : "text-slate-300 hover:text-white hover:bg-white/10"
        )}
        title="AI Agent Actions"
      >
        <Bot className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline text-xs">AI Agent</span>
        {isOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </Button>

      {/* AI Agent Actions Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.6)] border border-gray-700/50 z-[10000]">
          <div className="p-3 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/50">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-noteflow-400" />
              <h3 className="text-white font-medium text-sm">AI Agent</h3>
            </div>
          </div>

          <div className="p-2 flex flex-col gap-1 bg-gray-900/90">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('quick_improve')}
              className="justify-start text-white hover:bg-gray-700/60 h-8 px-3"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Quick Improve
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('suggest_edits')}
              className="justify-start text-white hover:bg-gray-700/60 h-8 px-3"
            >
              <FileText className="h-4 w-4 mr-2" />
              Suggest Edits
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('brainstorm')}
              className="justify-start text-white hover:bg-gray-700/60 h-8 px-3"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Brainstorm Ideas
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('chat_mode')}
              className="justify-start text-white hover:bg-gray-700/60 h-8 px-3"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with AI
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('writing_assistant')}
              className="justify-start text-white hover:bg-gray-700/60 h-8 px-3"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Writing Assistant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIActionsDropdown;
