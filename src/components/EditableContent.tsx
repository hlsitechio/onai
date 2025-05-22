
import React, { useRef, useEffect, useState } from "react";
import { marked } from "marked";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({ content, setContent }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [rawContent, setRawContent] = useState(content);

  // Update rawContent when content prop changes
  useEffect(() => {
    setRawContent(content);
  }, [content]);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleInput = () => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerText || '';
        setRawContent(newContent);
        setContent(newContent);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle tab key to insert spaces instead of changing focus
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '    ');
      }
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain') || '';
      document.execCommand('insertText', false, text);
    };
    
    const editorElement = editorRef.current;
    
    // Use multiple event listeners for better control
    editorElement.addEventListener('input', handleInput);
    editorElement.addEventListener('keydown', handleKeyDown);
    editorElement.addEventListener('paste', handlePaste);
    
    return () => {
      editorElement.removeEventListener('input', handleInput);
      editorElement.removeEventListener('keydown', handleKeyDown);
      editorElement.removeEventListener('paste', handlePaste);
    };
  }, [setContent]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderMarkdown = (text: string) => {
    try {
      return { __html: marked.parse(text) };
    } catch (error) {
      return { __html: text };
    }
  };

  return (
    <div className="relative h-full">
      {isEditing ? (
        <div 
          ref={editorRef}
          contentEditable
          className="min-h-[400px] h-full p-6 outline-none font-sans text-white bg-black/20 backdrop-blur-md overflow-auto"
          suppressContentEditableWarning={true}
          style={{ 
            lineHeight: '1.6',
            fontSize: '16px',
            direction: 'ltr',
            textAlign: 'left'
          }}
          dir="ltr"
          spellCheck="true"
        >
          {rawContent}
        </div>
      ) : (
        <div 
          className="min-h-[400px] h-full p-6 outline-none font-sans text-white bg-black/20 backdrop-blur-md overflow-auto markdown-preview"
          style={{ lineHeight: '1.6' }}
          dangerouslySetInnerHTML={renderMarkdown(rawContent)}
          onClick={toggleEditMode}
        />
      )}
      
      <button 
        onClick={toggleEditMode}
        className="absolute bottom-4 right-4 bg-noteflow-600/80 hover:bg-noteflow-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
      >
        {isEditing ? "Preview" : "Edit"}
      </button>
    </div>
  );
};

export default EditableContent;
