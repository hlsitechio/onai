
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Sparkles, 
  MessageSquare, 
  Wand2, 
  FileText, 
  Languages,
  Lightbulb,
  Zap,
  PenTool,
  Type,
  BookOpen
} from 'lucide-react';

interface AIFloatingToolbarProps {
  onOpenChat: () => void;
  onQuickAction: (action: string) => void;
  isVisible: boolean;
  className?: string;
}

const AIFloatingToolbar: React.FC<AIFloatingToolbarProps> = ({
  onOpenChat,
  onQuickAction,
  isVisible,
  className = ''
}) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  if (!isVisible) return null;

  const quickActions = [
    {
      icon: Wand2,
      label: 'Improve Writing',
      action: 'improve',
      description: 'Enhance clarity and style'
    },
    {
      icon: FileText,
      label: 'Summarize',
      action: 'summarize',
      description: 'Create a concise summary'
    },
    {
      icon: Languages,
      label: 'Translate',
      action: 'translate',
      description: 'Translate to another language'
    },
    {
      icon: Lightbulb,
      label: 'Generate Ideas',
      action: 'ideas',
      description: 'Brainstorm related concepts'
    },
    {
      icon: PenTool,
      label: 'Continue Writing',
      action: 'continue',
      description: 'AI continues your text'
    },
    {
      icon: Type,
      label: 'Fix Grammar',
      action: 'grammar',
      description: 'Fix grammar and spelling'
    }
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 ${className}`}>
      {/* Quick Actions Menu */}
      <Popover open={isQuickMenuOpen} onOpenChange={setIsQuickMenuOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 bg-black/80 backdrop-blur-lg border-white/20 text-white hover:bg-black/90 shadow-xl"
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick AI
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-3 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl mb-2"
          side="top"
          align="end"
        >
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-noteflow-400" />
              Quick AI Actions
            </h3>
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onQuickAction(action.action);
                  setIsQuickMenuOpen(false);
                }}
                className="w-full justify-start text-left text-white hover:bg-white/10 h-auto p-3"
              >
                <action.icon className="h-4 w-4 mr-3 text-noteflow-400 flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">{action.label}</span>
                  <span className="text-xs text-slate-400">{action.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Chat Button */}
      <Button
        onClick={onOpenChat}
        className="h-12 w-12 rounded-full bg-noteflow-500 hover:bg-noteflow-600 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
        title="Open AI Chat"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AIFloatingToolbar;
