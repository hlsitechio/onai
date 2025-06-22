
import React from 'react';
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ sidebarOpen, onToggleSidebar }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleSidebar}
      className={cn(
        "h-10 px-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg border border-transparent",
        sidebarOpen && "bg-gray-700/30 text-white border-gray-600/50"
      )}
    >
      <PanelRight className={`h-4 w-4 mr-2 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
      <span className="text-sm font-medium">Notes</span>
    </Button>
  );
};

export default SidebarToggle;
