
import React from "react";

interface SidebarPanelProps {
  children: React.ReactNode;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ children }) => {
  return (
    <div className="h-full w-full animate-fadeIn relative">
      <div className="h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidebarPanel;
