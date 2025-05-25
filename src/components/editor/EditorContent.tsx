
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import AnimatedPlaceholder from "./AnimatedPlaceholder";

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
    try {
      if (editorRef.current && typeof editorRef.current.innerHTML === 'string') {
        setContent(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error('Error handling input in EditorContent:', error);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    try {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      
      if (!text) {
        console.warn('No text data in clipboard');
        return;
      }

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
    } catch (error) {
      console.error('Error handling paste in EditorContent:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    try {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    } catch (error) {
      console.error('Error handling keydown in EditorContent:', error);
    }
  };

  // Sync content with the editor with better error handling
  useEffect(() => {
    try {
      if (editorRef.current && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || '';
      }
    } catch (error) {
      console.error('Error syncing content in EditorContent:', error);
    }
  }, [content, editorRef]);

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
        data-placeholder=""
      />
      
      {/* Animated placeholder */}
      <AnimatedPlaceholder isVisible={!content} />
      
      {/* Static tip below the animated placeholder */}
      {!content && (
        <div className="absolute top-16 left-6 text-slate-500 pointer-events-none text-sm select-none">
          💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent
        </div>
      )}
    </div>
  );
};

export default EditorContent;
