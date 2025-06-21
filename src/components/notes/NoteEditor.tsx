
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  noteId: string | null;
  content: string;
  onContentChange: (content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  noteId,
  content,
  onContentChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Update editor content when content prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Basic keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          break;
      }
    }

    // Handle Enter key for better line breaks
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>');
    }
  };

  if (!noteId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No note selected</h3>
          <p className="text-sm">Create a new note or select an existing one to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex-1 p-6 outline-none bg-transparent text-white",
          "prose prose-lg max-w-none dark:prose-invert",
          "focus:ring-0 focus:outline-none leading-relaxed",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3",
          "[&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-noteflow-500 [&_blockquote]:pl-4 [&_blockquote]:italic"
        )}
        style={{
          minHeight: '100%',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        suppressContentEditableWarning={true}
        placeholder="Start writing your note..."
      />
    </div>
  );
};

export default NoteEditor;
