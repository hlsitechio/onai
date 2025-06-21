
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Settings, Users, Zap } from 'lucide-react';

interface EnhancedSettingsProps {
  isEnhanced: boolean;
  onToggleEnhanced: (enabled: boolean) => void;
  roomId: string;
  onRoomIdChange: (roomId: string) => void;
}

const EnhancedSettings: React.FC<EnhancedSettingsProps> = ({
  isEnhanced,
  onToggleEnhanced,
  roomId,
  onRoomIdChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Enhanced Settings"
        >
          <Zap className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Enhanced Editor Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enable enhanced features powered by Liveblocks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Toggle Enhanced Features */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enhanced-toggle" className="text-sm font-medium">
                Enhanced Features
              </Label>
              <p className="text-xs text-gray-400 mt-1">
                User presence awareness, activity tracking, and more
              </p>
            </div>
            <Switch
              id="enhanced-toggle"
              checked={isEnhanced}
              onCheckedChange={onToggleEnhanced}
            />
          </div>

          {/* Enhanced Features List */}
          {isEnhanced && (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Features
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• User presence awareness</li>
                <li>• Typing activity indicators</li>
                <li>• Online user count</li>
                <li>• Real-time connection status</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSettings;
