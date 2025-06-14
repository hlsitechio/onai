
import React from 'react';

interface NotesSidebarContainerProps {
  children: React.ReactNode;
}

const NotesSidebarContainer: React.FC<NotesSidebarContainerProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col text-white overflow-hidden animate-fadeIn h-full">
      {children}
    </div>
  );
};

export default NotesSidebarContainer;
