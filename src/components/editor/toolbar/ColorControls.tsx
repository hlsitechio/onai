
import React, { useState } from 'react';
import { Palette, Type, Highlighter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ColorControlsProps {
  editor?: any; // Made optional since we'll use execCommand fallback
}

const ColorControls: React.FC<ColorControlsProps> = ({ editor }) => {
  const [selectedTextColor, setSelectedTextColor] = useState('#ffffff');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('#fbbf24');

  const textColors = [
    '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff',
    '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a',
    '#059669', '#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed',
    '#9333ea', '#c026d3', '#db2777', '#e11d48'
  ];

  const highlightColors = [
    'transparent', '#fef3c7', '#fde68a', '#fbbf24', '#f59e0b',
    '#fecaca', '#f87171', '#ef4444', '#dc2626',
    '#d1fae5', '#86efac', '#4ade80', '#22c55e',
    '#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb',
    '#e9d5ff', '#c084fc', '#a855f7', '#9333ea'
  ];

  const handleTextColorChange = (color: string) => {
    setSelectedTextColor(color);
    console.log(`Setting text color to: ${color}`);
    
    // Try the editor chain method first, then fall back to execCommand
    try {
      if (editor?.chain?.focus) {
        editor.chain().focus().setColor(color).run();
      } else {
        // Use document.execCommand for basic browsers
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('foreColor', false, color);
      }
    } catch (error) {
      console.log('Falling back to execCommand for text color');
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('foreColor', false, color);
    }
  };

  const handleHighlightColorChange = (color: string) => {
    setSelectedHighlightColor(color);
    console.log(`Setting highlight color to: ${color}`);
    
    try {
      if (editor?.chain?.focus) {
        if (color === 'transparent') {
          editor.chain().focus().unsetHighlight().run();
        } else {
          editor.chain().focus().toggleHighlight({ color }).run();
        }
      } else {
        // Use document.execCommand for highlighting
        if (color === 'transparent') {
          document.execCommand('hiliteColor', false, 'transparent');
        } else {
          document.execCommand('styleWithCSS', false, 'true');
          document.execCommand('hiliteColor', false, color);
        }
      }
    } catch (error) {
      console.log('Falling back to execCommand for highlight');
      if (color === 'transparent') {
        document.execCommand('hiliteColor', false, 'transparent');
      } else {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('hiliteColor', false, color);
      }
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
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b"
              style={{ backgroundColor: selectedTextColor }}
            />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-64 bg-[#27202C] border-white/10 text-white z-50 p-3"
        >
          <div className="mb-3">
            <span className="text-sm font-medium">Text Color</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {textColors.map((color) => (
              <button
                key={color}
                onClick={() => handleTextColorChange(color)}
                className={cn(
                  "w-8 h-8 rounded border-2 hover:scale-110 transition-transform",
                  selectedTextColor === color 
                    ? "border-white shadow-lg" 
                    : "border-white/20 hover:border-white/40"
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
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
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b"
              style={{ backgroundColor: selectedHighlightColor }}
            />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-64 bg-[#27202C] border-white/10 text-white z-50 p-3"
        >
          <div className="mb-3">
            <span className="text-sm font-medium">Highlight Color</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {/* Remove highlight option */}
            <button
              onClick={() => handleHighlightColorChange('transparent')}
              className={cn(
                "w-8 h-8 rounded border-2 hover:scale-110 transition-transform flex items-center justify-center",
                selectedHighlightColor === 'transparent' 
                  ? "border-white shadow-lg" 
                  : "border-white/20 hover:border-white/40",
                "bg-transparent"
              )}
              title="Remove highlight"
            >
              <span className="text-red-400 text-xs font-bold">×</span>
            </button>
            
            {highlightColors.slice(1).map((color) => (
              <button
                key={color}
                onClick={() => handleHighlightColorChange(color)}
                className={cn(
                  "w-8 h-8 rounded border-2 hover:scale-110 transition-transform",
                  selectedHighlightColor === color 
                    ? "border-white shadow-lg" 
                    : "border-white/20 hover:border-white/40"
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColorControls;
