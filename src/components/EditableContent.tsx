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
      
      // Markdown shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b': // Bold
            e.preventDefault();
            wrapSelectedText('**', '**');
            break;
          case 'i': // Italic
            e.preventDefault();
            wrapSelectedText('_', '_');
            break;
          case 'h': // Heading
            e.preventDefault();
            prefixLine('# ');
            break;
        }
      }
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain') || '';
      document.execCommand('insertText', false, text);
    };
    
    // Function to wrap selected text with markdown formatting
    const wrapSelectedText = (prefix: string, suffix: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
        document.execCommand('insertText', false, `${prefix}${selectedText}${suffix}`);
      }
    };
    
    // Function to prefix the current line
    const prefixLine = (prefix: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        const startOffset = 0;
        const beforeCursor = textContent.substring(0, startOffset);
        const afterCursor = textContent.substring(startOffset);
        
        // Find the start of the line
        const lastNewline = beforeCursor.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        const linePrefix = beforeCursor.substring(0, lineStart);
        const lineContent = beforeCursor.substring(lineStart);
        
        // Check if already prefixed
        if (!lineContent.startsWith(prefix)) {
          node.textContent = linePrefix + prefix + lineContent + afterCursor;
          
          // Set cursor after the prefix
          const newPosition = lineStart + prefix.length + lineContent.length;
          const newRange = document.createRange();
          newRange.setStart(node, newPosition);
          newRange.setEnd(node, newPosition);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
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
      const renderer = new marked.Renderer();
      
      // Fix link renderer to match the interfaces expected by marked
      // @ts-ignore - We need to override the type to match what marked actually expects
      renderer.link = function(href: string, title: string | null, text: string) {
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">${text}</a>`;
      };
      
      // Use only supported options
      marked.setOptions({
        renderer,
        breaks: true, // Add line breaks on single newlines
        gfm: true,    // GitHub Flavored Markdown
      });
      
      return { __html: marked.parse(text) };
    } catch (error) {
      console.error('Error parsing markdown:', error);
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
            textAlign: 'left',
            whiteSpace: 'pre-wrap', // Preserve line breaks
            wordBreak: 'break-word' // Prevent overflow
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
        className="absolute bottom-4 right-4 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
      >
        {isEditing ? "Preview" : "Edit"}
      </button>
    </div>
  );
};

export default EditableContent;
