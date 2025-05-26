
import React, { useState } from "react";
import { Type, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface FontControlsProps {
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (action: 'increase' | 'decrease' | 'set', size?: number) => void;
}

const FontControls: React.FC<FontControlsProps> = ({
  onFontFamilyChange,
  onFontSizeChange
}) => {
  const [currentFont, setCurrentFont] = useState("Inter");

  const fonts = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Times", value: "Times New Roman, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Courier", value: "Courier New, monospace" },
    { name: "Monaco", value: "Monaco, monospace" }
  ];

  const handleFontChange = (font: { name: string; value: string }) => {
    setCurrentFont(font.name);
    onFontFamilyChange(font.value);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Font Family Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 min-w-[80px] justify-start"
            title="Font Family"
          >
            <Type className="h-4 w-4 mr-1" />
            <span className="text-xs">{currentFont}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-48 bg-black/90 backdrop-blur-xl border border-white/10 text-white"
          side="bottom"
          align="start"
        >
          {fonts.map((font) => (
            <DropdownMenuItem
              key={font.name}
              onClick={() => handleFontChange(font)}
              className="hover:bg-white/10 focus:bg-white/10"
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFontSizeChange('decrease')}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 w-8 h-8"
          title="Decrease Font Size"
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFontSizeChange('increase')}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 w-8 h-8"
          title="Increase Font Size"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default FontControls;
