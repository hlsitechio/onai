
import React, { useState } from 'react';
import { Palette, Highlighter, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface ColorControlsProps {
  editor: Editor;
}

const ColorControls: React.FC<ColorControlsProps> = ({ editor }) => {
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  const textColors = [
    '#000000', '#374151', '#6b7280', '#9ca3af',
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
  ];

  const highlightColors = [
    '#fef3c7', '#fed7aa', '#fecaca', '#f3e8ff',
    '#dbeafe', '#d1fae5', '#ffedd5', '#fce7f3'
  ];

  const handleTextColor = (color: string) => {
    setTextColor(color);
    try {
      editor.chain().focus().setColor(color).run();
    } catch {
      document.execCommand('foreColor', false, color);
    }
  };

  const handleHighlight = (color: string) => {
    setHighlightColor(color);
    try {
      editor.chain().focus().toggleHighlight({ color }).run();
    } catch {
      document.execCommand('hiliteColor', false, color);
    }
  };

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
  
  const handleFontSize = (size: string) => {
    try {
      // Try to use CSS styling
      document.execCommand('fontSize', false, '7');
      const fontElements = document.getElementsByTagName('font');
      for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].size === '7') {
          fontElements[i].removeAttribute('size');
          fontElements[i].style.fontSize = size;
        }
      }
    } catch {
      // Fallback
      document.execCommand('fontSize', false, size);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Text Color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white/10 transition-colors text-gray-300 hover:text-white relative"
            title="Text Color"
          >
            <Type className="h-4 w-4" />
            <div 
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 rounded"
              style={{ backgroundColor: textColor }}
            />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-32 bg-[#27202C] border-white/10 text-white z-50 p-3"
        >
          <div className="grid grid-cols-6 gap-1">
            {textColors.map((color) => (
              <button
                key={color}
                onClick={() => handleTextColor(color)}
                className="w-5 h-5 rounded border border-white/20 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <DropdownMenuSeparator className="bg-white/10 my-2" />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColor(e.target.value)}
              className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
            />
            <span className="text-xs text-gray-400">Custom</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Highlight Color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white/10 transition-colors text-gray-300 hover:text-white relative"
            title="Highlight Color"
          >
            <Highlighter className="h-4 w-4" />
            <div 
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 rounded"
              style={{ backgroundColor: highlightColor }}
            />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-32 bg-[#27202C] border-white/10 text-white z-50 p-3"
        >
          <div className="grid grid-cols-4 gap-1">
            {highlightColors.map((color) => (
              <button
                key={color}
                onClick={() => handleHighlight(color)}
                className="w-5 h-5 rounded border border-white/20 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <DropdownMenuSeparator className="bg-white/10 my-2" />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => handleHighlight(e.target.value)}
              className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
            />
            <span className="text-xs text-gray-400">Custom</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            title="Font Size"
          >
            <span className="text-xs">Size</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-24 bg-[#27202C] border-white/10 text-white z-50"
        >
          {fontSizes.map((size) => (
            <DropdownMenuItem
              key={size}
              onClick={() => handleFontSize(size)}
              className="flex items-center justify-center px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
            >
              <span className="text-xs">{size}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColorControls;
