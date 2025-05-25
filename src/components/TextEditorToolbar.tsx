
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ToolbarNavigation from "./toolbar/ToolbarNavigation";
import ToolbarActions from "./toolbar/ToolbarActions";
import ToolbarStatus from "./toolbar/ToolbarStatus";
import OCRPopup from "./ocr/OCRPopup";

interface TextEditorToolbarProps {
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  toggleAI: () => void;
  isSidebarOpen: boolean;
  isAISidebarOpen?: boolean;
  lastSaved: Date | null;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
  onSpeechTranscript?: (transcript: string) => void;
  onToggleAIAgent?: () => void;
  isAIAgentVisible?: boolean;
  content?: string;
  onApplyAIChanges?: (newContent: string) => void;
  onInsertText?: (text: string) => void;
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleSidebar,
  toggleAI,
  isSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode = false,
  toggleFocusMode = () => {},
  onSpeechTranscript,
  onToggleAIAgent,
  isAIAgentVisible = false,
  content = "",
  onApplyAIChanges = () => {},
  onInsertText = () => {}
}) => {
  const [isOCROpen, setIsOCROpen] = useState(false);

  const handleOCRTextExtracted = (text: string) => {
    onInsertText(text);
  };

  return (
    <>
      <div className={cn(
        "flex flex-wrap items-center justify-between p-2 md:p-3 transition-all duration-300",
        isFocusMode 
          ? "bg-black/70 backdrop-blur-xl border-b border-purple-800/20" 
          : "bg-black/40 backdrop-blur-lg border-b border-white/10"
      )}>
        {/* Left side - navigation and formatting tools */}
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <ToolbarNavigation
            toggleSidebar={toggleSidebar}
            onSpeechTranscript={onSpeechTranscript}
            onOCRClick={() => setIsOCROpen(true)}
          />

          <div className="w-px h-6 bg-white/10 hidden md:block"></div>

          <ToolbarActions
            execCommand={execCommand}
            isFocusMode={isFocusMode}
          />
        </div>

        {/* Right side - status and actions */}
        <ToolbarStatus
          handleSave={handleSave}
          lastSaved={lastSaved}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
          content={content}
          onApplyAIChanges={onApplyAIChanges}
        />
      </div>

      {/* OCR Popup */}
      <OCRPopup
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
        onTextExtracted={handleOCRTextExtracted}
      />
    </>
  );
};

export default TextEditorToolbar;
