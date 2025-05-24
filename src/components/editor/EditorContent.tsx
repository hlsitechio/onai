
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
    
    // Use modern approach instead of deprecated execCommand
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    handleInput();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      onSave();
    }
  };

  // Sync content with the editor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div 
        ref={editorRef}
        className={cn(
          "w-full h-full p-6 text-white overflow-y-auto resize-none border-none outline-none transition-all duration-300",
          "text-lg leading-relaxed min-h-[500px]",
          "prose prose-invert max-w-none",
          "focus:ring-0 focus:outline-none",
          "[&>*]:mb-4 [&>*:last-child]:mb-0",
          "[&_p]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white",
          "[&_ul]:text-white [&_ol]:text-white [&_li]:text-white",
          "[&_strong]:text-white [&_em]:text-white",
          isFocusMode ? "bg-black/70" : "bg-black/30"
        )}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        style={{ 
          minHeight: '500px',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder="Start writing your note..."
      />
      
      {/* Show placeholder when content is empty */}
      {!content && (
        <div className="absolute top-6 left-6 text-slate-400 pointer-events-none text-lg select-none">
          Start writing your note...
        </div>
      )}
    </div>
  );
};

export default EditorContent;
