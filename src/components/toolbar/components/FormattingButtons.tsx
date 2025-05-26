
import React from "react";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleBold, handleItalic, handleUnderline, handleStrikethrough } from '../utils/formattingUtils';

const FormattingButtons: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBold}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleItalic}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleUnderline}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleStrikethrough}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FormattingButtons;
