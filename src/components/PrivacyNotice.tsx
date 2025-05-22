
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrivacyNoticeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Privacy Notice</DialogTitle>
          <DialogDescription>
            How Onlinenote.ai protects your data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold">Data Storage</h3>
          <p>
            All notes are stored locally in your browser and encrypted using AES-256 encryption.
            We do not store your notes on our servers unless you explicitly choose to sync them.
          </p>
          
          <h3 className="font-semibold">Encryption</h3>
          <p>
            Your notes are encrypted using a unique encryption key stored only on your device.
            This means even if someone gains access to your stored notes, they cannot read them
            without your encryption key.
          </p>
          
          <h3 className="font-semibold">Analytics & Tracking</h3>
          <p>
            We use minimal analytics to understand app usage patterns. No personally identifiable
            information or note contents are ever shared with our analytics services.
          </p>
          
          <h3 className="font-semibold">Advertisement</h3>
          <p>
            We show some advertisements to support our free service. These ads may use cookies
            but do not have access to your notes or personal information.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyNotice;
