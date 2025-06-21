
import React, { useState } from "react";
import AIChatSidebar from "../ai-chat/AIChatSidebar";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedAISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
  onClose?: () => void;
}

const EnhancedAISidebar: React.FC<EnhancedAISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "h-full flex flex-col bg-gradient-to-br from-[#03010a] to-[#0a0518] border-l border-white/10",
      isExpanded ? "w-[600px]" : "w-full"
    )}>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            title="Close AI Chat"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <AIChatSidebar 
          content={content}
          onApplyChanges={onApplyChanges}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default EnhancedAISidebar;
