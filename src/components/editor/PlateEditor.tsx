
import React, { useRef, useEffect } from 'react';
import SimpleToolbar from './SimpleToolbar';

interface PlateEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const PlateEditor: React.FC<PlateEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
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
    // Handle basic keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          break;
      }
    }

    // Handle Enter key for better line breaks
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
      {!isFocusMode && (
        <div className="border-b border-white/10 p-2">
          <SimpleToolbar />
        </div>
      )}
      
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="h-full overflow-y-auto px-4 py-2 prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] focus:outline-none bg-transparent text-white leading-relaxed"
          data-placeholder="Start writing your note..."
          suppressContentEditableWarning
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        />
      </div>
    </div>
  );
};

export default PlateEditor;
