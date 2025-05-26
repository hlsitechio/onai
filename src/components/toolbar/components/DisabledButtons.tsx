
import React from "react";
import { AlignLeft, AlignCenter, AlignRight, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

const DisabledButtons: React.FC = () => {
  return (
    <div className="hidden xl:flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
        title="Text alignment not available in plain text mode"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
        title="Text alignment not available in plain text mode"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
        title="Text alignment not available in plain text mode"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
        title="Undo not available in plain text mode"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
        title="Redo not available in plain text mode"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DisabledButtons;
