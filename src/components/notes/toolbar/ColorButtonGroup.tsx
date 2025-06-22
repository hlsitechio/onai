
import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette, ChevronDown } from "lucide-react";

const ColorButtonGroup: React.FC = () => {
  return (
    <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md flex items-center gap-1.5"
        title="Text Color"
      >
        <Palette className="h-3.5 w-3.5" />
        <div className="w-3 h-3 bg-blue-500 rounded-sm border border-gray-500/50" />
        <ChevronDown className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ColorButtonGroup;
