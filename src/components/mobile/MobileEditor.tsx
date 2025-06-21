
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedPlaceholder from '../editor/AnimatedPlaceholder';

interface MobileEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode: boolean;
  placeholder?: string;
}

const MobileEditor: React.FC<MobileEditorProps> = ({
  content,
  setContent,
  isFocusMode,
  placeholder = "Start writing your note..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
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

    // Prevent default tab behavior and insert spaces instead
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={cn(
      "flex-1 flex flex-col relative",
      isFocusMode && "focus-mode"
    )}>
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full flex flex-col">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className={cn(
              "flex-1 p-4 outline-none bg-transparent",
              "prose prose-sm max-w-none dark:prose-invert",
              "focus:ring-0 focus:outline-none leading-relaxed",
              !content && "text-muted-foreground"
            )}
            style={{
              minHeight: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
          {!content && (
            <div className="absolute top-4 left-4 pointer-events-none">
              <AnimatedPlaceholder isVisible={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileEditor;
