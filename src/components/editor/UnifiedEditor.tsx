
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useToolbarActions } from '@/hooks/useToolbarActions';
import AnimatedPlaceholder from './AnimatedPlaceholder';

interface UnifiedEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  placeholder?: string;
  editor?: any;
}

const UnifiedEditor: React.FC<UnifiedEditorProps> = ({
  content,
  setContent,
  isFocusMode = false,
  placeholder = "Start writing your note...",
  editor
}) => {
  const { isMobile } = useDeviceDetection();
  const editorRef = useRef<HTMLDivElement>(null);
  const { execCommand } = useToolbarActions(editor);

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
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            execCommand('redo');
          } else {
            e.preventDefault();
            execCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
      }
    }

    // Handle Enter key for better line breaks
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      execCommand('insertHTML', '<br><br>');
    }

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertText', '    ');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    execCommand('insertText', text);
  };

  return (
    <div className={cn(
      "flex-1 flex flex-col relative",
      isFocusMode && "focus-mode",
      isMobile ? "bg-background" : "bg-gradient-to-br from-[#03010a] to-[#0a0518]"
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
              "flex-1 outline-none leading-relaxed",
              isMobile ? [
                "p-4 prose prose-sm max-w-none dark:prose-invert",
                "focus:ring-0 focus:outline-none text-foreground"
              ] : [
                "px-4 py-2 prose prose-lg max-w-none dark:prose-invert",
                "focus:ring-0 focus:outline-none text-white",
                "min-h-[300px]"
              ],
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
            <div className={cn(
              "absolute pointer-events-none",
              isMobile ? "top-4 left-4" : "top-2 left-4"
            )}>
              <AnimatedPlaceholder isVisible={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedEditor;
