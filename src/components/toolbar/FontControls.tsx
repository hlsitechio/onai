
import React, { useState } from "react";
import { Type, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

interface FontControlsProps {
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (action: 'increase' | 'decrease' | 'set', size?: number) => void;
}

const FontControls: React.FC<FontControlsProps> = ({
  onFontFamilyChange,
  onFontSizeChange
}) => {
  const [currentFont, setCurrentFont] = useState("Inter");
  const [fontSize, setFontSize] = useState(16);

  const fonts = [
    { name: "Inter", value: "Inter, sans-serif", category: "Sans Serif" },
    { name: "SF Pro", value: "-apple-system, BlinkMacSystemFont, sans-serif", category: "System" },
    { name: "Roboto", value: "Roboto, sans-serif", category: "Sans Serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif", category: "Sans Serif" },
    { name: "Lato", value: "Lato, sans-serif", category: "Sans Serif" },
    { name: "Georgia", value: "Georgia, serif", category: "Serif" },
    { name: "Times New Roman", value: "Times New Roman, serif", category: "Serif" },
    { name: "Playfair Display", value: "Playfair Display, serif", category: "Serif" },
    { name: "Merriweather", value: "Merriweather, serif", category: "Serif" },
    { name: "Courier New", value: "Courier New, monospace", category: "Monospace" },
    { name: "Monaco", value: "Monaco, monospace", category: "Monospace" },
    { name: "Fira Code", value: "Fira Code, monospace", category: "Monospace" },
    { name: "JetBrains Mono", value: "JetBrains Mono, monospace", category: "Monospace" }
  ];

  const groupedFonts = fonts.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, typeof fonts>);

  const handleFontChange = (font: { name: string; value: string }) => {
    setCurrentFont(font.name);
    onFontFamilyChange(font.value);
  };

  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    onFontSizeChange('set', newSize);
  };

  const resetToDefault = () => {
    setCurrentFont("Inter");
    setFontSize(16);
    onFontFamilyChange("Inter, sans-serif");
    onFontSizeChange('set', 16);
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
            <span className="text-xs truncate max-w-[60px]">{currentFont}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-black/90 backdrop-blur-xl border border-white/10 text-white max-h-96 overflow-y-auto"
          side="bottom"
          align="start"
        >
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Font Family</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefault}
                className="h-6 w-6 p-0"
                title="Reset to default"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            {Object.entries(groupedFonts).map(([category, categoryFonts]) => (
              <div key={category}>
                <DropdownMenuLabel className="text-xs text-slate-400 px-0 py-1">
                  {category}
                </DropdownMenuLabel>
                {categoryFonts.map((font) => (
                  <DropdownMenuItem
                    key={font.name}
                    onClick={() => handleFontChange(font)}
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                    style={{ fontFamily: font.value }}
                  >
                    <span className={currentFont === font.name ? "font-semibold" : ""}>
                      {font.name}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10 my-1" />
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size Controls */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 min-w-[50px] justify-center"
            title="Font Size"
          >
            <span className="text-xs">{fontSize}px</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-48 bg-black/90 backdrop-blur-xl border border-white/10 text-white"
          side="bottom"
          align="start"
        >
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Font Size</span>
              <span className="text-xs text-slate-400">{fontSize}px</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newSize = Math.max(fontSize - 2, 8);
                  setFontSize(newSize);
                  onFontSizeChange('set', newSize);
                }}
                className="h-6 w-6 p-0"
                title="Decrease"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="flex-1 px-2">
                <Slider
                  value={[fontSize]}
                  onValueChange={handleSizeChange}
                  max={32}
                  min={8}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newSize = Math.min(fontSize + 2, 32);
                  setFontSize(newSize);
                  onFontSizeChange('set', newSize);
                }}
                className="h-6 w-6 p-0"
                title="Increase"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-1">
              {[10, 12, 14, 16, 18, 20, 24, 28].map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setFontSize(size);
                    onFontSizeChange('set', size);
                  }}
                  className="h-6 text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FontControls;
