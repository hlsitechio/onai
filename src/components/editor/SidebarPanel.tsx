
import React from "react";

interface SidebarPanelProps {
  children: React.ReactNode;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col animate-fadeIn">
      {children}
    </div>
  );
};

export default SidebarPanel;
