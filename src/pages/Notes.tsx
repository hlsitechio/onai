
import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import NotesEditor from '@/components/notes/NotesEditor';
import MobileLayout from '@/components/mobile/MobileLayout';

const Notes: React.FC = () => {
  const { isMobile } = useDeviceDetection();

  // If mobile, show mobile layout
  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gradient-to-br from-[#050510] to-[#0a0518]">
      <div className="relative z-10 flex w-full h-full">
        <NotesEditor />
      </div>
    </div>
  );
};

export default Notes;
