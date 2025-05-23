import React, { useRef, useEffect, useState } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({ content, setContent, isFocusMode = false }) => {
  // Always in editing mode since Preview button is removed
  const [rawContent, setRawContent] = useState(content);

  // Update rawContent when content prop changes
  useEffect(() => {
    setRawContent(content);
  }, [content]);

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
    <div className="relative h-full w-full mx-auto">
      {/* Subtle glow effect behind the text area in focus mode */}
      {isFocusMode && (
        <div className="absolute inset-0 bg-gradient-spotlight from-purple-900/20 via-noteflow-800/10 to-transparent -m-3 rounded-2xl blur-2xl opacity-80 pointer-events-none"></div>
      )}
      <textarea 
        className={cn(
          "min-h-[550px] w-full h-full p-3 md:p-4 outline-none font-sans text-white overflow-auto resize-none transition-all duration-300 max-w-full mx-auto editable-content-textarea",
          isFocusMode 
            ? "bg-black/50 backdrop-blur-xl shadow-note-glow border border-purple-800/20 z-10" 
            : "bg-black/30 backdrop-blur-lg border border-white/10"
        )}
        style={{ 
          lineHeight: '1.9',
          fontSize: isFocusMode ? '22px' : '20px',
          direction: 'ltr',
          textAlign: 'left',
          whiteSpace: 'pre-wrap', // Preserve line breaks
          wordBreak: 'break-word', // Prevent overflow
          caretColor: 'white', // Make cursor visible
          color: 'white',
          border: 'none',
          fontWeight: '400',
          letterSpacing: '0.015em'
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
      
      {/* Preview/Edit button removed as requested */}
    </div>
  );
};

export default EditableContent;
