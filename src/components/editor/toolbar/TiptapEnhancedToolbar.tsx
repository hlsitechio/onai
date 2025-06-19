
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import FormatControls from './FormatControls';
import HeadingControls from './HeadingControls';
import ListControls from './ListControls';
import AlignmentControls from './AlignmentControls';
import InsertControls from './InsertControls';
import HistoryControls from './HistoryControls';

interface TiptapEnhancedToolbarProps {
  editor: Editor;
  onAIClick?: () => void;
}

const TiptapEnhancedToolbar: React.FC<TiptapEnhancedToolbarProps> = ({ 
  editor, 
  onAIClick 
}) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 p-1 bg-black/20 rounded-lg flex-wrap">
      {/* AI Assistant Button */}
      {onAIClick && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAIClick}
            className="text-noteflow-400 hover:text-noteflow-300 hover:bg-noteflow-500/20 flex items-center gap-1.5"
            title="Open AI Assistant (Ctrl+Shift+A)"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">AI</span>
          </Button>
          <Separator orientation="vertical" className="h-6 bg-white/20" />
        </>
      )}

      {/* Format Controls */}
      <FormatControls editor={editor} />
      
      <Separator orientation="vertical" className="h-6 bg-white/20" />
      
      {/* Heading Controls */}
      <HeadingControls editor={editor} />
      
      <Separator orientation="vertical" className="h-6 bg-white/20" />
      
      {/* List Controls */}
      <ListControls editor={editor} />
      
      <Separator orientation="vertical" className="h-6 bg-white/20" />
      
      {/* Alignment Controls - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-1">
        <AlignmentControls editor={editor} />
        <Separator orientation="vertical" className="h-6 bg-white/20" />
      </div>
      
      {/* Insert Controls - Hidden on small screens */}
      <div className="hidden lg:flex items-center gap-1">
        <InsertControls editor={editor} />
        <Separator orientation="vertical" className="h-6 bg-white/20" />
      </div>
      
      {/* History Controls */}
      <HistoryControls editor={editor} />
    </div>
  );
};

export default TiptapEnhancedToolbar;
