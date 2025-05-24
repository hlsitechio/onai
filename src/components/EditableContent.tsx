
import React, { useRef, useEffect, useState } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import InlineAIActions from "./ai-agent/InlineAIActions";
import AIAgent from "./ai-agent/AIAgent";
import { useAIAgent } from "@/hooks/useAIAgent";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  onSpeechTranscript?: (transcript: string) => void;
  onToggleAIAgent?: () => void;
  isAIAgentVisible?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({ 
  content, 
  setContent, 
  isFocusMode = false,
  onSpeechTranscript,
  onToggleAIAgent,
  isAIAgentVisible = false
}) => {
  const [rawContent, setRawContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    selectedText,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
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
    if (!transcript.trim() || !onSpeechTranscript) return;
    onSpeechTranscript(transcript);
  };

  // Keyboard shortcuts for AI agent
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to toggle AI agent
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onToggleAIAgent?.();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onToggleAIAgent]);

  return (
    <div className="relative h-full w-full mx-auto">
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
        onChange={(e) => {
          const newContent = e.target.value;
          setRawContent(newContent);
          setContent(newContent);
        }}
        onSelect={handleTextAreaSelection}
        onMouseUp={handleTextAreaSelection}
        onKeyUp={handleCursorChange}
        onClick={handleCursorChange}
        placeholder="Start typing your note here...

💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent"
      />

      {/* AI Agent */}
      {isAIAgentVisible && (
        <AIAgent
          content={rawContent}
          onContentChange={(newContent) => {
            setRawContent(newContent);
            setContent(newContent);
          }}
          cursorPosition={cursorPosition}
          isVisible={isAIAgentVisible}
        />
      )}

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
