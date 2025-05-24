
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditorContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode: boolean;
  onSave: () => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

const EditorContent: React.FC<EditorContentProps> = ({
  content,
  setContent,
  isFocusMode,
  onSave,
  editorRef
}) => {
  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand("insertText", false, text);
    handleInput();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      onSave();
    }
  };

  // Handle placeholder behavior for contentEditable div
  useEffect(() => {
    if (editorRef.current) {
      const handleFocus = () => {
        if (editorRef.current && editorRef.current.innerHTML === '') {
          editorRef.current.innerHTML = '';
        }
      };

      const handleBlur = () => {
        if (editorRef.current && editorRef.current.innerHTML.trim() === '') {
          editorRef.current.innerHTML = '';
        }
      };

      const element = editorRef.current;
      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);

      return () => {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
      };
    }
  }, [editorRef]);

  return (
    <div 
      ref={editorRef}
      className={cn(
        "flex-1 p-4 md:p-6 lg:p-8 text-white overflow-y-auto resize-none border-none outline-none transition-all duration-300",
        "text-base md:text-lg leading-relaxed",
        "prose prose-invert max-w-none",
        "focus:ring-0 focus:outline-none",
        "[&>*]:mb-4 [&>*:last-child]:mb-0",
        "[&_p]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white",
        "[&_ul]:text-white [&_ol]:text-white [&_li]:text-white",
        "[&_strong]:text-white [&_em]:text-white",
        isFocusMode ? "bg-black/90" : "bg-black/50"
      )}
      contentEditable
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      style={{ 
        minHeight: 'calc(100% - 2rem)',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
      data-placeholder="Start writing your note..."
    />
  );
};

export default EditorContent;
