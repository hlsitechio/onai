
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useToolbarActions } from '@/hooks/useToolbarActions';

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
      "flex-1 flex flex-col relative h-full",
      "bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90",
      isFocusMode && "bg-black"
    )}>
      {/* Main editor container */}
      <div className={cn(
        "flex-1 relative",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600/50 hover:scrollbar-thumb-slate-500/70",
        "overflow-auto",
        isFocused && "ring-1 ring-blue-500/30"
      )}>
        {/* Content editable area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            "w-full h-full min-h-full outline-none border-none",
            "text-slate-100 leading-relaxed font-normal",
            "prose prose-lg prose-invert max-w-none",
            "prose-headings:text-slate-100 prose-p:text-slate-200",
            "prose-strong:text-white prose-em:text-slate-300",
            "prose-code:text-blue-300 prose-code:bg-slate-800/50 prose-code:px-1 prose-code:rounded",
            "prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-slate-700/50",
            "prose-blockquote:border-l-blue-400 prose-blockquote:text-slate-300",
            "prose-ul:text-slate-200 prose-ol:text-slate-200",
            "prose-li:text-slate-200",
            "selection:bg-blue-500/20",
            isMobile ? "p-4 text-base" : "p-8 text-lg",
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
            "text-slate-500 text-lg font-light z-10"
          )}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>{placeholder}</span>
              </div>
              <div className="text-sm text-slate-600 ml-5">
                {isMobile ? "Tap to start writing" : "Click here or use keyboard shortcuts for formatting"}
              </div>
            </div>
          </div>
        )}

        {/* Focus mode indicator */}
        {isFocusMode && (
          <div className="absolute top-6 right-6 text-blue-400 text-sm font-medium opacity-70 z-10">
            Focus Mode
          </div>
        )}

        {/* Writing stats */}
        {!isEmpty && (
          <div className="absolute bottom-6 right-6 text-slate-500 text-xs font-mono z-10 bg-slate-800/50 px-2 py-1 rounded">
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
