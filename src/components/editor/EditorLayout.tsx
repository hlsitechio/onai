
import React from "react";
import { cn } from "@/lib/utils";
import FocusModeOverlay from "./FocusModeOverlay";
import "../../styles/rotating-border.css";

interface EditorLayoutProps {
  isFocusMode: boolean;
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  isFocusMode,
  children
}) => {
  return (
    <section id="editor-section" className={cn(
      "pt-0 pb-4 sm:pb-6 px-3 relative transition-all duration-500 w-full overflow-hidden border-0"
    )}>
      {/* Enhanced focus mode overlay */}
      <FocusModeOverlay isFocusMode={isFocusMode} />
      
      <div className={cn(
        "mx-auto px-1 sm:px-2 md:px-3 w-full relative",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        {/* Rotating border container with proper positioning */}
        <div className={cn(
          "relative w-full", 
          isFocusMode && "focus-mode"
        )}>
          {/* Multiple glow layers for enhanced effect */}
          <div className={cn(
            "rotating-border-glow rotating-border-pulse",
            isFocusMode && "focus-mode"
          )}></div>
          
          {/* Main container with rotating border */}
          <div className={cn(
            "rotating-border-container relative w-full",
            isFocusMode && "focus-mode"
          )}>
            {/* Inner content with proper background and height */}
            <div className="rotating-border-inner w-full">
              <div className="w-full h-[calc(100vh-120px)] min-h-[500px] p-1 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorLayout;
