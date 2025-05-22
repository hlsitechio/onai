
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2, Link, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareNoteDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShareNote: (service: 'onedrive' | 'googledrive' | 'device' | 'link') => Promise<string | null>;
  shareUrl: string | null;
}

const ShareNoteDrawer: React.FC<ShareNoteDrawerProps> = ({
  isOpen,
  onOpenChange,
  onShareNote,
  shareUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  
  // Reset copied state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);
  
  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleCreateShareLink = async () => {
    setIsCreatingLink(true);
    try {
      await onShareNote('link');
    } finally {
      setIsCreatingLink(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Your Note
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-6">
          {/* Share link section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Link className="h-4 w-4" /> Share via Link
            </h3>
            
            {shareUrl ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={shareUrl} 
                  readOnly 
                  className="bg-black/30 border-white/10 text-white"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0 bg-black/30 border-white/10 hover:bg-black/40"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full justify-center bg-black/30 border-white/10 hover:bg-black/40"
                onClick={handleCreateShareLink}
                disabled={isCreatingLink}
              >
                {isCreatingLink ? "Creating link..." : "Create Share Link"}
              </Button>
            )}
            
            <p className="text-xs text-slate-400">
              Anyone with this link can view your note. No login required.
            </p>
          </div>
          
          <div className="h-px bg-white/10" />
          
          {/* Download section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Options
            </h3>
            
            <Button 
              variant="outline" 
              className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
              onClick={() => onShareNote('device')}
            >
              Save to Device
            </Button>
          </div>
        </div>
        
        <DrawerFooter className="border-t border-white/10 pt-2">
          <span className="text-xs text-gray-400">
            Your notes are private unless you share them
          </span>
          <DrawerClose asChild>
            <Button variant="outline" className="mt-2 border-white/10 hover:bg-black/40">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareNoteDrawer;
