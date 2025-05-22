
import React, { useRef, useEffect } from "react";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({ content, setContent }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleInput = () => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle backspace and delete keys properly
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Let the browser handle the default action
        // Then sync the content state after a small delay
        requestAnimationFrame(() => {
          if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
          }
        });
      }
    };
    
    const editorElement = editorRef.current;
    
    // Use both input event (for general typing) and specific key handlers
    editorElement.addEventListener('input', handleInput);
    editorElement.addEventListener('keydown', handleKeyDown);
    
    return () => {
      editorElement.removeEventListener('input', handleInput);
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [setContent]);

  return (
    <div 
      ref={editorRef}
      contentEditable
      className="min-h-[400px] p-6 outline-none font-sans text-white bg-black/20 backdrop-blur-md"
      dangerouslySetInnerHTML={{ __html: content }}
      onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
      onBlur={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
      suppressContentEditableWarning={true}
      style={{ 
        minHeight: '400px', 
        height: '450px',
        maxHeight: '600px', 
        overflowY: 'auto',
        lineHeight: '1.6',
        fontSize: '16px',
        direction: 'ltr', // Explicitly set left-to-right text direction
        textAlign: 'left' // Ensure text alignment is left
      }}
      dir="ltr" // HTML5 direction attribute to force left-to-right
    />
  );
};

export default EditableContent;
