import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';
import FormatControls from './toolbar/controls/FormatControls';
import HeadingControls from './toolbar/controls/HeadingControls';
import ListControls from './toolbar/controls/ListControls';
import AlignmentControls from './toolbar/controls/AlignmentControls';
import HistoryControls from './toolbar/controls/HistoryControls';

interface TiptapMainToolbarProps {
  editor: Editor;
  onShowAIAgent: () => void;
}

const TiptapMainToolbar: React.FC<TiptapMainToolbarProps> = ({
  editor,
  onShowAIAgent
}) => {
  if (!editor) return null;

  return (
    <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/40 backdrop-blur-lg">
      {/* Left side - Formatting controls */}
      <div className="flex items-center gap-2">
        <FormatControls editor={editor} />
        
        <div className="w-px h-6 bg-white/10" />
        
        <HeadingControls editor={editor} />

        <div className="w-px h-6 bg-white/10" />

        <ListControls editor={editor} />

        <div className="w-px h-6 bg-white/10 hidden md:block" />

        <div className="hidden md:flex">
          <AlignmentControls editor={editor} />
        </div>
      </div>

      {/* Right side - AI and actions */}
      <div className="flex items-center gap-1">
        <HistoryControls editor={editor} />

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button
          onClick={onShowAIAgent}
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
          title="Open AI Agent (Ctrl+Shift+A)"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs">AI</span>
        </Button>
      </div>
    </div>
  );
};

export default TiptapMainToolbar;
