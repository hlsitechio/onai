
import React from 'react';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isOpen = false,
  onToggle,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        "h-8 w-8 p-0",
        isOpen 
          ? "text-white bg-white/10" 
          : "text-slate-400 hover:text-white hover:bg-white/10",
        className
      )}
      title="Toggle notes sidebar"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
};

export default SidebarToggle;
