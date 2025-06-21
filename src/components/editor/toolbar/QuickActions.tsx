
import React from 'react';
import { Settings, Keyboard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  toggleAISidebar?: () => void;
  isAISidebarOpen?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  toggleAISidebar,
  isAISidebarOpen = false
}) => {
  const actionButtons = [
    {
      icon: Settings,
      onClick: () => console.log('Settings clicked'),
      title: 'Settings',
      className: 'text-gray-400 hover:text-white hover:bg-white/10'
    },
    {
      icon: Sparkles,
      onClick: toggleAISidebar || (() => {}),
      title: 'AI Assistant',
      className: cn(
        'relative',
        isAISidebarOpen 
          ? 'text-noteflow-300 bg-noteflow-500/20' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      )
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {actionButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              button.className
            )}
            title={button.title}
          >
            <Icon className="h-4 w-4" />
            {button.icon === Sparkles && isAISidebarOpen && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-noteflow-400 rounded-full animate-pulse" />
            )}
          </Button>
        );
      })}
      
      {/* Keyboard shortcut hint */}
      <div className="hidden lg:flex items-center gap-1.5 ml-2 text-xs text-slate-500">
        <Keyboard className="h-3 w-3" />
        <span>Ctrl+/ for shortcuts</span>
      </div>
    </div>
  );
};

export default QuickActions;
