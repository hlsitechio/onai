
import React from "react";
import { cn } from "@/lib/utils";
import FocusModeOverlay from "./FocusModeOverlay";

interface EditorLayoutProps {
  isFocusMode: boolean;
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  isFocusMode,
  children
}) => {
  return (
    <div className={cn(
      "min-h-screen w-full relative",
      "bg-gradient-to-br from-[#050510] to-[#0a0518]"
    )}>
      {/* Enhanced focus mode overlay */}
      <FocusModeOverlay isFocusMode={isFocusMode} />
      
      {/* Main content container */}
      <div className={cn(
        "w-full h-screen relative",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        {/* Content wrapper with proper height */}
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
