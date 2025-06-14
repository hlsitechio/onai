
import React from "react";
import { cn } from "@/lib/utils";
import FocusModeOverlay from "./FocusModeOverlay";
import "../styles/rotating-border.css";

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
      "pt-0 pb-4 sm:pb-6 px-3 relative transition-all duration-500 min-h-screen w-full overflow-hidden border-0"
    )}>
      {/* Enhanced focus mode overlay */}
      <FocusModeOverlay isFocusMode={isFocusMode} />
      
      <div className={cn(
        "mx-auto px-1 sm:px-2 md:px-3 w-full relative h-full",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        {/* Rotating border container - only contains the glow and border */}
        <div className={cn(
          "relative w-full", // Position for glow and full width
          isFocusMode && "focus-mode"
        )}>
          {/* Glow effect positioned behind */}
          <div className={cn(
            "rotating-border-glow rotating-border-pulse",
            isFocusMode && "focus-mode"
          )}></div>
          
          {/* Main container with rotating border */}
          <div className={cn(
            "rotating-border-container relative w-full",
            isFocusMode && "focus-mode"
          )}>
            {/* Inner content - this prevents border from covering content */}
            <div className="rotating-border-inner w-full">
              <div className="w-full h-[80vh] md:h-[85vh] lg:h-[90vh] p-3 md:p-4 lg:p-6">
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
