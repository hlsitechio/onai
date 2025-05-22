import React, { useRef, useEffect, useState } from "react";
import { marked } from "marked";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({ content, setContent }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [rawContent, setRawContent] = useState(content);

  // Update rawContent when content prop changes
  useEffect(() => {
    setRawContent(content);
  }, [content]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderMarkdown = (text: string) => {
    try {
      const renderer = new marked.Renderer();
      
      // Fix link renderer to match the interfaces expected by marked
      // @ts-expect-error - We need to override the type to match what marked actually expects
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

  // Use a textarea to ensure proper text direction and editing
  return (
    <div className="relative h-full">
      {isEditing ? (
        <textarea 
          className="min-h-[400px] w-full h-full p-6 outline-none font-sans text-white bg-black/20 backdrop-blur-md overflow-auto resize-none"
          style={{ 
            lineHeight: '1.6',
            fontSize: '16px',
            direction: 'ltr',
            textAlign: 'left',
            whiteSpace: 'pre-wrap', // Preserve line breaks
            wordBreak: 'break-word', // Prevent overflow
            caretColor: 'white', // Make cursor visible
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: 'white',
            border: 'none'
          }}
          spellCheck="true"
          value={rawContent}
          onChange={(e) => {
            const newContent = e.target.value;
            setRawContent(newContent);
            setContent(newContent);
          }}
          placeholder="Start typing your note here..."
        />
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
