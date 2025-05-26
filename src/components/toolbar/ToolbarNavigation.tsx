
import React from "react";
import { PanelLeft, FileText, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeechToTextButton from "../SpeechToTextButton";
import OCRButton from "../ocr/OCRButton";

interface ToolbarNavigationProps {
  toggleSidebar: () => void;
  onSpeechTranscript?: (transcript: string) => void;
  onOCRClick: () => void;
  onExportNote?: () => void;
  onImportNote?: () => void;
  onNewNote?: () => void;
}

const ToolbarNavigation: React.FC<ToolbarNavigationProps> = ({
  toggleSidebar,
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

      <div className="w-px h-6 bg-white/10"></div>

      {/* File Operations */}
      <div className="hidden md:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewNote}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="New Note"
        >
          <FileText className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Export Note"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleImport}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Import Note"
        >
          <Upload className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10"></div>
      </div>

      {/* OCR and Speech to Text */}
      <div className="flex items-center gap-1">
        <OCRButton onClick={onOCRClick} />
        
        {onSpeechTranscript && (
          <SpeechToTextButton 
            onTranscript={onSpeechTranscript}
            className="p-1.5 md:p-2 h-8 w-8 text-slate-300 hover:text-white hover:bg-white/10"
          />
        )}
      </div>
    </div>
  );
};

export default ToolbarNavigation;
