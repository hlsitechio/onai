
import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import AnimatedPlaceholder from "./AnimatedPlaceholder";

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
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      // Ensure the target still exists before processing
      if (!e.target || typeof e.target.value !== 'string') {
        console.warn('Invalid target in content change handler');
        return;
      }
      onContentChange(e.target.value);
    } catch (error) {
      console.error('Error handling content change in TextAreaEditor:', error);
    }
  };

  const handleSelection = () => {
    try {
      // Check if textarea ref exists before proceeding
      if (!textareaRef.current) {
        console.warn('Textarea ref is null in selection handler');
        return;
      }
      onTextAreaSelection();
    } catch (error) {
      console.error('Error handling selection in TextAreaEditor:', error);
    }
  };

  const handleCursorChangeEvent = () => {
    try {
      // Check if textarea ref exists before proceeding
      if (!textareaRef.current) {
        console.warn('Textarea ref is null in cursor change handler');
        return;
      }
      onCursorChange();
    } catch (error) {
      console.error('Error handling cursor change in TextAreaEditor:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key to insert spaces instead of losing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const newValue = value.substring(0, start) + '    ' + value.substring(end);
        
        // Update the content
        onContentChange(newValue);
        
        // Set cursor position after the inserted spaces
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 4;
            textareaRef.current.selectionEnd = start + 4;
          }
        }, 0);
      }
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Subtle glow effect behind the text area in focus mode */}
      {isFocusMode && (
        <div className="absolute inset-0 bg-gradient-spotlight from-purple-900/20 via-noteflow-800/10 to-transparent -m-3 rounded-2xl blur-2xl opacity-80 pointer-events-none"></div>
      )}
      
      {/* Main textarea */}
      <Textarea
        ref={textareaRef}
        value={rawContent}
        onChange={handleContentChange}
        onSelect={handleSelection}
        onKeyUp={handleCursorChangeEvent}
        onMouseUp={handleCursorChangeEvent}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full min-h-[500px] p-6 bg-transparent text-white resize-none border-none outline-none",
          "text-lg leading-relaxed font-mono",
          "focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder:text-slate-500 placeholder:opacity-70",
          isFocusMode ? "bg-black/70" : "bg-black/30"
        )}
        placeholder=""
        style={{
          minHeight: isFocusMode ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      />
      
      {/* Animated placeholder */}
      <AnimatedPlaceholder isVisible={!rawContent} />
      
      {/* Static tip below the animated placeholder */}
      {!rawContent && (
        <div className="absolute top-20 left-6 text-slate-500 pointer-events-none text-sm select-none opacity-70">
          💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent
        </div>
      )}
    </div>
  );
};

export default TextAreaEditor;
