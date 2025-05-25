import React from "react";
import { cn } from "@/lib/utils";
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
  const handleCursorChange = () => {
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
  return <>
      {/* Subtle glow effect behind the text area in focus mode */}
      {isFocusMode && <div className="absolute inset-0 bg-gradient-spotlight from-purple-900/20 via-noteflow-800/10 to-transparent -m-3 rounded-2xl blur-2xl opacity-80 pointer-events-none"></div>}
      
      <textarea ref={textareaRef} style={{
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
    }} spellCheck="true" value={rawContent || ''} onChange={handleContentChange} onSelect={handleSelection} onMouseUp={handleSelection} onKeyUp={handleCursorChange} onClick={handleCursorChange} placeholder="" className="" />
      
      {/* Animated placeholder */}
      <AnimatedPlaceholder isVisible={!rawContent} />
      
      {/* Static tip below the animated placeholder - moved lower to avoid interference */}
      {!rawContent && <div className="absolute top-20 left-6 text-slate-500 pointer-events-none text-sm select-none opacity-70">
          💡 Tip: Select text and use AI actions, or press Ctrl+Shift+A for the AI agent
        </div>}
    </>;
};
export default TextAreaEditor;