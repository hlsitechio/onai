
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface ShareNoteDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShareNote: (service: 'onedrive' | 'googledrive' | 'device') => void;
}

const ShareNoteDrawer: React.FC<ShareNoteDrawerProps> = ({
  isOpen,
  onOpenChange,
  onShareNote
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
        <DrawerHeader>
          <DrawerTitle>Share Note</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
            onClick={() => onShareNote('onedrive')}
          >
            Save to OneDrive
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
            onClick={() => onShareNote('googledrive')}
          >
            Save to Google Drive
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
            onClick={() => onShareNote('device')}
          >
            Download to Device
          </Button>
        </div>
        <DrawerFooter className="border-t border-white/10 pt-2">
          <span className="text-xs text-gray-400">
            Note sharing requires browser permissions
          </span>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareNoteDrawer;
