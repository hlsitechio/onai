
import React from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleImportFile, handleExportMarkdown } from '../utils/fileUtils';

const FileOperationButtons: React.FC = () => {
  return (
    <div className="hidden lg:flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleImportFile}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Import File"
      >
        <Upload className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleExportMarkdown}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Export as Markdown"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileOperationButtons;
