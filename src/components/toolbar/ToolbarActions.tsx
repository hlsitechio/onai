
import React from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolbarActionsProps {
  execCommand: (command: string, value?: string | null) => void;
  isFocusMode: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  execCommand,
  isFocusMode
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2">
      {/* Formatting buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('bold', null)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('italic', null)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('underline', null)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>

      {/* Alignment buttons - hidden on mobile */}
      <div className="hidden md:flex items-center gap-1">
        <div className="w-px h-6 bg-white/10"></div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10"></div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ToolbarActions;
