
import React from "react";

interface SidebarPanelProps {
  children: React.ReactNode;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col animate-fadeIn bg-black/30 backdrop-blur-sm border-r border-white/10">
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidebarPanel;
