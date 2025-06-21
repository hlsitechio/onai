
import React, { useState } from 'react';
import { Type, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const FontControls: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState('Arial');

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Arial Black'
  ];

  const handleFontChange = (fontName: string) => {
    setSelectedFont(fontName);
    try {
      document.execCommand('fontName', false, fontName);
    } catch {
      // Fallback: apply font via CSS
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontFamily = fontName;
        try {
          range.surroundContents(span);
        } catch {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          title="Font Family"
        >
          <Type className="h-4 w-4 mr-1" />
          <span className="text-xs">{selectedFont}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-40 bg-[#27202C] border-white/10 text-white z-50 max-h-64 overflow-y-auto"
      >
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font}
            onClick={() => handleFontChange(font)}
            className={cn(
              "flex items-center px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10",
              selectedFont === font && "bg-white/20 text-white"
            )}
            style={{ fontFamily: font }}
          >
            <span className="text-sm">{font}</span>
            {selectedFont === font && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontControls;
