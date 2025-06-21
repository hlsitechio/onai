
import React, { useRef, useEffect, useState } from 'react';
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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
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
      execCommand('insertHTML', '<div><br></div>');
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

  const isEmpty = !content || content === '<div><br></div>' || content === '<p></p>' || content.trim() === '';

  return (
    <div className={cn(
      "flex-1 flex flex-col relative overflow-hidden",
      "bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f18]",
      isFocusMode && "bg-black",
      "border-0 outline-none"
    )}>
      {/* Enhanced editor container */}
      <div className={cn(
        "flex-1 relative overflow-auto",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10",
        isFocused && "ring-1 ring-purple-500/30"
      )}>
        {/* Main editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            "w-full h-full outline-none border-none",
            "text-white/90 leading-relaxed font-normal",
            "prose prose-lg prose-invert max-w-none",
            "prose-headings:text-white prose-p:text-white/90",
            "prose-strong:text-white prose-em:text-white/80",
            "prose-code:text-purple-300 prose-code:bg-purple-900/20",
            "prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-white/10",
            "prose-blockquote:border-l-purple-500 prose-blockquote:text-white/80",
            "prose-ul:text-white/90 prose-ol:text-white/90",
            "prose-li:text-white/90",
            isMobile ? "p-4 text-base" : "p-8 text-lg",
            "min-h-full",
            "focus:outline-none focus:ring-0"
          )}
          style={{
            minHeight: '100%',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.75'
          }}
          suppressContentEditableWarning={true}
          data-placeholder={placeholder}
        />
        
        {/* Enhanced placeholder */}
        {isEmpty && (
          <div className={cn(
            "absolute pointer-events-none select-none",
            isMobile ? "top-4 left-4" : "top-8 left-8",
            "text-white/30 text-lg font-light"
          )}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>{placeholder}</span>
              </div>
              <div className="text-sm text-white/20 ml-4">
                {isMobile ? "Tap to start writing" : "Click here or use Ctrl+shortcuts for formatting"}
              </div>
            </div>
          </div>
        )}

        {/* Focus mode indicator */}
        {isFocusMode && (
          <div className="absolute top-4 right-4 text-purple-400 text-sm font-medium opacity-50">
            Focus Mode
          </div>
        )}

        {/* Writing stats (word count, etc.) */}
        {!isEmpty && (
          <div className="absolute bottom-4 right-4 text-white/30 text-xs font-mono">
            {(() => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = content;
              const text = tempDiv.textContent || tempDiv.innerText || '';
              const words = text.trim().split(/\s+/).filter(word => word.length > 0);
              const chars = text.length;
              return `${words.length} words • ${chars} chars`;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedEditor;
