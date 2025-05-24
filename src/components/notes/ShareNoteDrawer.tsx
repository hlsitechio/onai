
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
import { Copy, Check, Share2, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuickShareButtons from '../sharing/QuickShareButtons';
import AdvancedShareDialog from '../sharing/AdvancedShareDialog';
import { useAdvancedSharing } from '@/hooks/useAdvancedSharing';

interface ShareNoteDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShareNote: (service: 'onedrive' | 'googledrive' | 'device' | 'link') => Promise<string | null>;
  shareUrl?: string | null;
  content?: string;
  title?: string;
}

const ShareNoteDrawer: React.FC<ShareNoteDrawerProps> = ({
  isOpen,
  onOpenChange,
  onShareNote,
  shareUrl: legacyShareUrl,
  content = '',
  title
}) => {
  const [copied, setCopied] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const { 
    shareUrl, 
    handleQuickShare,
    clearShareUrl
  } = useAdvancedSharing();
  
  // Reset copied state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      clearShareUrl();
    }
  }, [isOpen, clearShareUrl]);
  
  const handleCopyLink = () => {
    const urlToCopy = shareUrl || legacyShareUrl;
    if (urlToCopy) {
      navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleCreateShareLink = async () => {
    if (content) {
      await handleQuickShare(content, 'url', { title });
    } else {
      // Fallback to legacy method
      await onShareNote('link');
    }
  };

  const currentShareUrl = shareUrl || legacyShareUrl;

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Share Your Note
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 space-y-6">
            {/* Quick Share Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Share</h3>
              <QuickShareButtons 
                content={content}
                title={title}
                onAdvancedShare={() => setIsAdvancedOpen(true)}
                variant="vertical"
                size="sm"
              />
            </div>
            
            <div className="h-px bg-white/10" />
            
            {/* Share Link Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Share Link</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdvancedOpen(true)}
                  className="text-xs hover:bg-white/10"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Advanced
                </Button>
              </div>
              
              {currentShareUrl ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={currentShareUrl} 
                    readOnly 
                    className="bg-black/30 border-white/10 text-white text-xs"
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
                  disabled={!content.trim()}
                >
                  Create Share Link
                </Button>
              )}
              
              <p className="text-xs text-slate-400">
                Anyone with this link can view your note. Link expires in 7 days.
              </p>
            </div>
          </div>
          
          <DrawerFooter className="border-t border-white/10 pt-2">
            <span className="text-xs text-gray-400 text-center">
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

      <AdvancedShareDialog 
        isOpen={isAdvancedOpen}
        onOpenChange={setIsAdvancedOpen}
        content={content}
        title={title}
      />
    </>
  );
};

export default ShareNoteDrawer;
