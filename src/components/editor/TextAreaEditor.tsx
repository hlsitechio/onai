
import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaEditorProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  rawContent: string;
  isFocusMode: boolean;
  onContentChange: (content: string) => void;
  onTextAreaSelection: () => void;
  onCursorChange: () => void;
}

const TextAreaEditor: React.FC<TextAreaEditorProps> = ({
  textareaRef,
  rawContent,
  isFocusMode,
  onContentChange,
  onTextAreaSelection,
  onCursorChange
}) => {
  return (
    <>
      {/* Subtle glow effect behind the text area in focus mode */}
      {isFocusMode && (
        <div className="absolute inset-0 bg-gradient-spotlight from-purple-900/20 via-noteflow-800/10 to-transparent -m-3 rounded-2xl blur-2xl opacity-80 pointer-events-none"></div>
      )}
      
      <textarea 
        ref={textareaRef}
        className={cn(
          "min-h-[550px] w-full h-full p-3 md:p-4 pr-8 outline-none font-sans text-white overflow-auto resize-none transition-all duration-300 max-w-full mx-auto editable-content-textarea",
          isFocusMode 
            ? "bg-black/50 backdrop-blur-xl shadow-note-glow border border-purple-800/20 z-10" 
            : "bg-black/30 backdrop-blur-lg border border-white/10"
        )}
        style={{ 
          lineHeight: '1.9',
          fontSize: isFocusMode ? '22px' : '20px',
          direction: 'ltr',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          caretColor: 'white',
          color: 'white',
          border: 'none',
          fontWeight: '400',
          letterSpacing: '0.015em'
        }}
        spellCheck="true"
        value={rawContent}
        onChange={(e) => onContentChange(e.target.value)}
        onSelect={onTextAreaSelection}
        onMouseUp={onTextAreaSelection}
        onKeyUp={onCursorChange}
        onClick={onCursorChange}
        placeholder="Start typing your note here...

💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent"
      />
    </>
  );
};

export default TextAreaEditor;
