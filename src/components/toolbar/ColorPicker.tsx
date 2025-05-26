
import React, { useState } from "react";
import { Palette, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ColorPickerProps {
  onColorChange: (color: string, type: 'text' | 'background') => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [activeType, setActiveType] = useState<'text' | 'background'>('text');

  const colors = [
    { name: "Default", value: "inherit", bg: "#ffffff" },
    { name: "Black", value: "#000000", bg: "#000000" },
    { name: "White", value: "#ffffff", bg: "#ffffff" },
    { name: "Red", value: "#ef4444", bg: "#ef4444" },
    { name: "Blue", value: "#3b82f6", bg: "#3b82f6" },
    { name: "Green", value: "#10b981", bg: "#10b981" },
    { name: "Yellow", value: "#f59e0b", bg: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6", bg: "#8b5cf6" },
    { name: "Pink", value: "#ec4899", bg: "#ec4899" },
    { name: "Orange", value: "#f97316", bg: "#f97316" },
    { name: "Gray", value: "#6b7280", bg: "#6b7280" },
    { name: "Indigo", value: "#6366f1", bg: "#6366f1" }
  ];

  const handleColorSelect = (color: string) => {
    onColorChange(color, activeType);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Text & Background Colors"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-black/90 backdrop-blur-xl border border-white/10 text-white p-3"
        side="bottom"
        align="start"
      >
        <div className="space-y-3">
          {/* Type selector */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={activeType === 'text' ? 'default' : 'ghost'}
              onClick={() => setActiveType('text')}
              className="flex-1 text-xs"
            >
              <Type className="h-3 w-3 mr-1" />
              Text
            </Button>
            <Button
              size="sm"
              variant={activeType === 'background' ? 'default' : 'ghost'}
              onClick={() => setActiveType('background')}
              className="flex-1 text-xs"
            >
              Background
            </Button>
          </div>

          {/* Color grid */}
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.value)}
                className="w-12 h-8 rounded border border-white/20 hover:border-white/40 transition-colors flex items-center justify-center"
                style={{ 
                  backgroundColor: color.bg,
                  border: color.value === 'inherit' ? '2px dashed #666' : undefined
                }}
                title={color.name}
              >
                {color.value === 'inherit' && (
                  <span className="text-xs text-gray-600">A</span>
                )}
              </button>
            ))}
          </div>

          {/* Custom color input */}
          <div className="pt-2 border-t border-white/10">
            <input
              type="color"
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-8 rounded border border-white/20 bg-transparent cursor-pointer"
              title="Custom Color"
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorPicker;
