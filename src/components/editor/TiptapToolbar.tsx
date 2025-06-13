
import React from 'react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';
import FormatControls from './toolbar/FormatControls';
import HeadingControls from './toolbar/HeadingControls';
import ListControls from './toolbar/ListControls';
import AlignmentControls from './toolbar/AlignmentControls';
import InsertControls from './toolbar/InsertControls';
import HistoryControls from './toolbar/HistoryControls';
import ToolbarSeparator from './toolbar/ToolbarSeparator';

interface TiptapToolbarProps {
  editor: Editor;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={cn(
      "sticky top-0 z-10 flex flex-wrap items-center gap-2 p-3",
      "bg-black/80 backdrop-blur-sm border-b border-white/10",
      "overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
    )}>
      {/* Text Formatting */}
      <FormatControls editor={editor} />
      
      <ToolbarSeparator />
      
      {/* Headings */}
      <HeadingControls editor={editor} />
      
      <ToolbarSeparator />
      
      {/* Lists */}
      <ListControls editor={editor} />
      
      <ToolbarSeparator />
      
      {/* Text Alignment */}
      <AlignmentControls editor={editor} />
      
      <ToolbarSeparator />
      
      {/* Insert Elements */}
      <InsertControls editor={editor} />
      
      <ToolbarSeparator />
      
      {/* History */}
      <HistoryControls editor={editor} />
    </div>
  );
};

export default TiptapToolbar;
