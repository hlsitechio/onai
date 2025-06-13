
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
    // Prevent default tab behavior and insert spaces instead
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
  };

  return (
    <div className={cn(
      "flex-1 overflow-hidden relative",
      isFocusMode ? "min-h-[calc(100vh-120px)]" : "min-h-[calc(100vh-200px)]"
    )}>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full p-6 bg-transparent text-white resize-none border-none outline-none overflow-y-auto",
          "text-base leading-normal",
          "touch-manipulation",
          "[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:leading-tight",
          "[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:leading-tight", 
          "[&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:leading-tight",
          "[&>p]:mb-2 [&>p]:leading-normal",
          "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-3",
          "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-3",
          "[&>li]:mb-0.5 [&>li]:leading-normal",
          "[&>blockquote]:border-l-4 [&>blockquote]:border-noteflow-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3",
          "[&>code]:bg-white/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm",
          "[&>pre]:bg-white/5 [&>pre]:p-4 [&>pre]:rounded [&>pre]:my-3 [&>pre]:overflow-x-auto",
          "focus:bg-white/5 transition-colors duration-200",
          // Mobile-specific optimizations
          "select-text",
          "-webkit-touch-callout-default",
          "break-words"
        )}
        data-placeholder=""
        style={{
          minHeight: isFocusMode ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)',
          WebkitUserSelect: 'text',
          userSelect: 'text',
          lineHeight: '1.4'
        }}
        suppressContentEditableWarning={true}
      />
      
      {/* Animated placeholder */}
      <AnimatedPlaceholder isVisible={!content} />
      
      {/* Static tip below the animated placeholder - moved lower and with reduced opacity */}
      {!content && (
        <div className="absolute top-20 left-6 text-slate-500 pointer-events-none text-sm select-none opacity-70">
          💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent
        </div>
      )}
    </div>
  );
};

export default MobileEditor;
