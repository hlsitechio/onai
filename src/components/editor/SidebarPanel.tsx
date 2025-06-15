
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  children: React.ReactNode;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ children }) => {
  return (
    <div className={cn(
      "h-full w-full flex flex-col",
      "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
      "border-r border-white/10",
      "animate-fadeIn"
    )}>
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidebarPanel;
