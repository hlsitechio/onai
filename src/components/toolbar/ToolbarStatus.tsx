
import React from "react";
import { Save, Focus, Clock, Palette, ZoomIn, ZoomOut, Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDistanceToNow } from "@/lib/utils";

interface ToolbarStatusProps {
  handleSave: () => void;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  onThemeToggle?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onPrint?: () => void;
  onExportPDF?: () => void;
  wordCount?: number;
  charCount?: number;
  readingTime?: number;
}

const ToolbarStatus: React.FC<ToolbarStatusProps> = ({
  handleSave,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  onThemeToggle,
  onZoomIn,
  onZoomOut,
  onPrint,
  onExportPDF,
  wordCount = 0,
  charCount = 0,
  readingTime = 0
}) => {
  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle();
    }
  };

  const handleZoomIn = () => {
    if (onZoomIn) {
      onZoomIn();
    }
  };

  const handleZoomOut = () => {
    if (onZoomOut) {
      onZoomOut();
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      // Default PDF export using browser print to PDF
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-1 md:gap-2 ml-auto">
      {/* Document Statistics */}
      {wordCount > 0 && (
        <div className="hidden xl:flex items-center text-xs text-slate-400 mr-2 space-x-3">
          <span>{wordCount} words</span>
          {charCount > 0 && <span>{charCount} chars</span>}
          {readingTime > 0 && <span>~{readingTime}min read</span>}
        </div>
      )}

      {/* Last saved indicator */}
      {lastSaved && (
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
          <Clock className="h-3 w-3" />
          <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
        </div>
      )}

      {/* Print and Export Controls */}
      <div className="hidden lg:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Print Document"
        >
          <Printer className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportPDF}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Export as PDF"
        >
          <FileDown className="h-4 w-4" />
        </Button>
      </div>

      {/* View Controls */}
      <div className="hidden lg:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleThemeToggle}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Toggle Theme"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      {/* Focus mode toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleFocusMode}
        className={cn(
          "p-1.5 md:p-2",
          isFocusMode 
            ? "text-purple-300 bg-purple-500/20 hover:bg-purple-500/30" 
            : "text-slate-300 hover:text-white hover:bg-white/10"
        )}
        title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
      >
        <Focus className="h-4 w-4" />
      </Button>

      {/* Save button */}
      <Button
        onClick={handleSave}
        size="sm"
        className="bg-noteflow-500 hover:bg-noteflow-600 text-white p-1.5 md:p-2 px-3 md:px-4"
        title="Save Note (Ctrl+S)"
      >
        <Save className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
};

export default ToolbarStatus;
