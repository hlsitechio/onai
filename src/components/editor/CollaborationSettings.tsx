
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Users, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CollaborationSettingsProps {
  isCollaborative: boolean;
  onToggleCollaboration: (enabled: boolean) => void;
  roomId: string;
  onRoomIdChange: (roomId: string) => void;
}

const CollaborationSettings: React.FC<CollaborationSettingsProps> = ({
  isCollaborative,
  onToggleCollaboration,
  roomId,
  onRoomIdChange
}) => {
  const [tempRoomId, setTempRoomId] = useState(roomId);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveSettings = () => {
    if (!tempRoomId.trim()) {
      toast({
        title: 'Invalid Room ID',
        description: 'Please enter a valid room ID',
        variant: 'destructive'
      });
      return;
    }

    onRoomIdChange(tempRoomId.trim());
    setIsOpen(false);
    
    toast({
      title: 'Settings Updated',
      description: 'Collaboration settings have been saved',
    });
  };

  const handleShareRoom = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Room Link Copied',
        description: 'Share this link with others to collaborate',
      });
    } catch (error) {
      toast({
        title: 'Failed to Copy',
        description: 'Please copy the room ID manually: ' + roomId,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Collaboration Settings"
        >
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaboration Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure real-time collaboration for your documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Toggle Collaboration */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="collaboration-toggle" className="text-sm font-medium">
                Enable Collaboration
              </Label>
              <p className="text-xs text-gray-400 mt-1">
                Allow multiple users to edit this document simultaneously
              </p>
            </div>
            <Switch
              id="collaboration-toggle"
              checked={isCollaborative}
              onCheckedChange={onToggleCollaboration}
            />
          </div>

          {/* Room ID Settings */}
          {isCollaborative && (
            <>
              <div className="space-y-2">
                <Label htmlFor="room-id" className="text-sm font-medium">
                  Room ID
                </Label>
                <Input
                  id="room-id"
                  value={tempRoomId}
                  onChange={(e) => setTempRoomId(e.target.value)}
                  placeholder="Enter a unique room identifier"
                  className="bg-white/5 border-white/20 text-white"
                />
                <p className="text-xs text-gray-400">
                  Users with the same room ID can collaborate together
                </p>
              </div>

              {/* Current Room Status */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Room</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {roomId}
                    </p>
                  </div>
                  <Button
                    onClick={handleShareRoom}
                    size="sm"
                    variant="outline"
                    className="text-xs border-white/20 hover:bg-white/10"
                  >
                    Share Room
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              size="sm"
              className="bg-noteflow-500 hover:bg-noteflow-600"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationSettings;
