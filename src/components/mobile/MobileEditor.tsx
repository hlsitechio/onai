
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
          "text-base leading-relaxed",
          "touch-manipulation",
          "[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4",
          "[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3", 
          "[&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2",
          "[&>p]:mb-4 [&>p]:leading-relaxed",
          "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4",
          "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4",
          "[&>li]:mb-1",
          "[&>blockquote]:border-l-4 [&>blockquote]:border-noteflow-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4",
          "[&>code]:bg-white/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm",
          "[&>pre]:bg-white/5 [&>pre]:p-4 [&>pre]:rounded [&>pre]:my-4 [&>pre]:overflow-x-auto",
          "focus:bg-white/5 transition-colors duration-200",
          // Mobile-specific optimizations
          "select-text",
          "-webkit-touch-callout-default",
          "break-words"
        )}
        data-placeholder={placeholder}
        style={{
          minHeight: isFocusMode ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)',
          WebkitUserSelect: 'text',
          userSelect: 'text'
        }}
        suppressContentEditableWarning={true}
      />
      
      {/* Placeholder */}
      {!content && (
        <div className="absolute top-6 left-6 text-slate-400 pointer-events-none text-base">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default MobileEditor;
