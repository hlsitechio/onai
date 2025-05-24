
import React from 'react';

interface FocusModeOverlayProps {
  isFocusMode: boolean;
}

const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ isFocusMode }) => {
  if (!isFocusMode) return null;

  return (
    <>
      {/* Full page black overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Solid black overlay */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Additional blur overlay for any remaining content */}
        <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl"></div>
        
        {/* Subtle animated gradients for depth */}
        <div className="absolute top-1/4 -left-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-purple-900/20 to-blue-900/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-[10%] w-[25%] h-[25%] rounded-full bg-gradient-to-l from-purple-800/15 to-pink-900/10 blur-[80px] animate-pulse"></div>
      </div>
    </>
  );
};

export default FocusModeOverlay;
