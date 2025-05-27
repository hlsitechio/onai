
import React from "react";
import { PanelLeft, FileText, Download, Upload, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeechToTextButton from "../SpeechToTextButton";
import OCRButton from "../ocr/OCRButton";

interface ToolbarNavigationProps {
  toggleSidebar: () => void;
  toggleAISidebar?: () => void;
  toggleGeminiPanel?: () => void;
  isAISidebarOpen?: boolean;
  isGeminiPanelOpen?: boolean;
  onSpeechTranscript?: (transcript: string) => void;
  onOCRClick: () => void;
  onExportNote?: () => void;
  onImportNote?: () => void;
  onNewNote?: () => void;
}

const ToolbarNavigation: React.FC<ToolbarNavigationProps> = ({
  toggleSidebar,
  toggleAISidebar,
  toggleGeminiPanel,
  isAISidebarOpen,
  isGeminiPanelOpen,
  onSpeechTranscript,
  onOCRClick,
  onExportNote,
  onImportNote,
  onNewNote
}) => {
  const handleExport = () => {
    if (onExportNote) {
      onExportNote();
    }
  };

  const handleImport = () => {
    if (onImportNote) {
      onImportNote();
    }
  };

  const handleNewNote = () => {
    if (onNewNote) {
      onNewNote();
    }
  };

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Main Navigation Group */}
      <div className="flex items-center space-x-1">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Toggle Notes Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* New Note - Always visible for quick access */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewNote}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="New Note (Ctrl+N)"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10"></div>

      {/* Input Methods Group */}
      <div className="flex items-center gap-1">
        {/* OCR Button - Extract text from images */}
        <OCRButton onClick={onOCRClick} />
        
        {/* Speech to Text - Voice input */}
        {onSpeechTranscript && (
          <SpeechToTextButton 
            onTranscript={onSpeechTranscript}
            className="p-1.5 md:p-2 h-8 w-8 text-slate-300 hover:text-white hover:bg-white/10"
          />
        )}
      </div>
      
      <div className="w-px h-6 bg-white/10"></div>
      
      {/* AI Tools */}
      <div className="flex items-center gap-1">
        {toggleAISidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAISidebar}
            className={`p-1.5 md:p-2 text-slate-300 hover:text-white hover:bg-white/10 ${isAISidebarOpen ? 'bg-white/10 text-white' : ''}`}
            title="Toggle AI Assistant"
          >
            <Bot className="h-4 w-4" />
          </Button>
        )}
        
        {toggleGeminiPanel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleGeminiPanel}
            className={`p-1.5 md:p-2 text-slate-300 hover:text-white hover:bg-white/10 ${isGeminiPanelOpen ? 'bg-white/10 text-white' : ''}`}
            title="Toggle Gemini 2.5 Flash"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="w-px h-6 bg-white/10"></div>

      {/* File Operations - Export/Import */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Export Note (Ctrl+Shift+E)"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleImport}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Import Note (Ctrl+Shift+I)"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ToolbarNavigation;
