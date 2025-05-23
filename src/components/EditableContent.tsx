
import React, { useRef, useEffect, useState } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import SpeechToTextButton from "./SpeechToTextButton";
import AIAgent from "./ai-agent/AIAgent";
import InlineAIActions from "./ai-agent/InlineAIActions";
import { useAIAgent } from "@/hooks/useAIAgent";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({ content, setContent, isFocusMode = false }) => {
  const [rawContent, setRawContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isAIAgentVisible,
    selectedText,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    toggleAIAgent,
    handleTextSelection,
    hideInlineActions,
    updateCursorPosition
  } = useAIAgent();

  // Update rawContent when content prop changes
  useEffect(() => {
    setRawContent(content);
  }, [content]);

  // Handle text selection in textarea
  const handleTextAreaSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    handleTextSelection({
      text: selectedText,
      start,
      end
    });
    
    updateCursorPosition(start);
  };

  // Handle cursor position changes
  const handleCursorChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    updateCursorPosition(textarea.selectionStart);
  };

  // Handle text replacement for inline AI actions
  const handleTextReplace = (newText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = rawContent.substring(0, start);
    const afterSelection = rawContent.substring(end);
    
    const newContent = beforeSelection + newText + afterSelection;
    setRawContent(newContent);
    setContent(newContent);

    // Update cursor position after replacement
    setTimeout(() => {
      const newPosition = start + newText.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
      updateCursorPosition(newPosition);
    }, 0);
  };

  // Handle text insertion for inline AI actions
  const handleTextInsert = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const beforeCursor = rawContent.substring(0, cursorPos);
    const afterCursor = rawContent.substring(cursorPos);
    
    // Add appropriate spacing
    const needsSpaceBefore = beforeCursor.length > 0 && !beforeCursor.endsWith(' ') && !beforeCursor.endsWith('\n');
    const needsSpaceAfter = afterCursor.length > 0 && !afterCursor.startsWith(' ') && !afterCursor.startsWith('\n');
    
    const insertText = (needsSpaceBefore ? ' ' : '') + text + (needsSpaceAfter ? ' ' : '');
    const newContent = beforeCursor + insertText + afterCursor;
    
    setRawContent(newContent);
    setContent(newContent);

    // Update cursor position after insertion
    setTimeout(() => {
      const newPosition = cursorPos + insertText.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
      updateCursorPosition(newPosition);
    }, 0);
  };

  // Handle speech-to-text transcript
  const handleSpeechTranscript = (transcript: string) => {
    if (!transcript.trim()) return;

    const textarea = textareaRef.current;
    if (textarea) {
      const cursorPosition = textarea.selectionStart;
      const textBefore = rawContent.substring(0, cursorPosition);
      const textAfter = rawContent.substring(cursorPosition);
      
      // Add a space before the transcript if needed
      const needsSpace = textBefore.length > 0 && !textBefore.endsWith(' ') && !textBefore.endsWith('\n');
      const newContent = textBefore + (needsSpace ? ' ' : '') + transcript + textAfter;
      
      setRawContent(newContent);
      setContent(newContent);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        const newPosition = cursorPosition + (needsSpace ? 1 : 0) + transcript.length;
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
        updateCursorPosition(newPosition);
      }, 0);
    }
  };

  // Keyboard shortcuts for AI agent
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to toggle AI agent
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAIAgent();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [toggleAIAgent]);

  return (
    <div className="relative h-full w-full mx-auto">
      {/* Subtle glow effect behind the text area in focus mode */}
      {isFocusMode && (
        <div className="absolute inset-0 bg-gradient-spotlight from-purple-900/20 via-noteflow-800/10 to-transparent -m-3 rounded-2xl blur-2xl opacity-80 pointer-events-none"></div>
      )}
      
      {/* Speech-to-text button */}
      <div className="absolute top-3 right-3 z-10">
        <SpeechToTextButton 
          onTranscript={handleSpeechTranscript}
          className="shadow-lg"
        />
      </div>
      
      {/* AI Agent toggle button */}
      <div className="absolute top-3 right-16 z-10">
        <button
          onClick={toggleAIAgent}
          className={cn(
            "p-2 rounded-lg transition-all duration-200 shadow-lg",
            isAIAgentVisible 
              ? "bg-noteflow-500 text-white shadow-noteflow-500/25" 
              : "bg-black/30 backdrop-blur-sm text-slate-300 hover:bg-noteflow-500/20 hover:text-noteflow-300"
          )}
          title="Toggle AI Agent (Ctrl+Shift+A)"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.38 5C9.06 5 5.6 8.46 5.6 12.78C5.6 17.1 9.06 20.56 13.38 20.56C17.7 20.56 21.16 17.1 21.16 12.78C21.16 11.84 21.1 10.92 20.99 10H21V9ZM19.78 12.78C19.78 16.32 16.92 19.18 13.38 19.18C9.84 19.18 6.98 16.32 6.98 12.78C6.98 9.24 9.84 6.38 13.38 6.38C16.92 6.38 19.78 9.24 19.78 12.78Z"/>
          </svg>
        </button>
      </div>
      
      <textarea 
        ref={textareaRef}
        className={cn(
          "min-h-[550px] w-full h-full p-3 md:p-4 pr-32 outline-none font-sans text-white overflow-auto resize-none transition-all duration-300 max-w-full mx-auto editable-content-textarea",
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
        onChange={(e) => {
          const newContent = e.target.value;
          setRawContent(newContent);
          setContent(newContent);
        }}
        onSelect={handleTextAreaSelection}
        onMouseUp={handleTextAreaSelection}
        onKeyUp={handleCursorChange}
        onClick={handleCursorChange}
        placeholder="Start typing your note here... or click the microphone to speak

💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent"
      />

      {/* AI Agent */}
      <AIAgent
        content={rawContent}
        onContentChange={(newContent) => {
          setRawContent(newContent);
          setContent(newContent);
        }}
        cursorPosition={cursorPosition}
        isVisible={isAIAgentVisible}
      />

      {/* Inline AI Actions */}
      <InlineAIActions
        selectedText={selectedText}
        onTextReplace={handleTextReplace}
        onTextInsert={handleTextInsert}
        position={inlineActionsPosition}
        isVisible={isInlineActionsVisible}
        onClose={hideInlineActions}
      />
    </div>
  );
};

export default EditableContent;
