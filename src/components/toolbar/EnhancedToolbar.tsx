
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  FileText, 
  Zap, 
  Search, 
  Share2, 
  MoreVertical,
  Focus,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SettingsDialog from '../settings/SettingsDialog';

interface EnhancedToolbarProps {
  onSave: () => void;
  onNewNote: () => void;
  onToggleAI: () => void;
  onToggleSearch: () => void;
  onShare: () => void;
  onToggleFocus: () => void;
  isFocusMode: boolean;
  lastSaved?: string;
  className?: string;
}

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  onSave,
  onNewNote,
  onToggleAI,
  onToggleSearch,
  onShare,
  onToggleFocus,
  isFocusMode,
  lastSaved,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-2 p-2 bg-white border-b", className)}>
      <Button onClick={onSave} size="sm" variant="outline">
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
      
      <Button onClick={onNewNote} size="sm" variant="outline">
        <FileText className="h-4 w-4 mr-2" />
        New
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button onClick={onToggleAI} size="sm" variant="outline">
        <Zap className="h-4 w-4 mr-2" />
        AI
      </Button>
      
      <Button onClick={onToggleSearch} size="sm" variant="outline">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
      
      <Button onClick={onShare} size="sm" variant="outline">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button 
        onClick={onToggleFocus} 
        size="sm" 
        variant={isFocusMode ? "default" : "outline"}
      >
        <Focus className="h-4 w-4 mr-2" />
        Focus
      </Button>
      
      <div className="flex-1" />
      
      {lastSaved && (
        <span className="text-xs text-gray-500">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </span>
      )}
      
      <SettingsDialog />
    </div>
  );
};

export default EnhancedToolbar;
