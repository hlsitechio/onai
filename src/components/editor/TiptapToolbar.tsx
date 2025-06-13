
import React from 'react';
import { Button } from '@/components/ui/button';
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
  onSave?: () => void;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor, onSave }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={cn(
      "sticky top-0 z-10 flex flex-wrap items-center gap-1 p-3",
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

      {/* Save Button */}
      {onSave && (
        <>
          <ToolbarSeparator />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
            title="Save (Ctrl+S)"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3-3-3m3-3v12" />
            </svg>
            Save
          </Button>
        </>
      )}
    </div>
  );
};

export default TiptapToolbar;
