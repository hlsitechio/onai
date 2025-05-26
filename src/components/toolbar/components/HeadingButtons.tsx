
import React from "react";
import { Heading1, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleHeading } from '../utils/formattingUtils';

const HeadingButtons: React.FC = () => {
  return (
    <div className="hidden lg:flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleHeading(1)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Heading 1 (Ctrl+Shift+1)"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleHeading(2)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Heading 2 (Ctrl+Shift+2)"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HeadingButtons;
