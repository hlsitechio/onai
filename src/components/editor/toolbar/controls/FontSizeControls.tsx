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

const FontSizeControls: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('16px');

  const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '16px' },
    { label: 'Medium', value: '18px' },
    { label: 'Large', value: '24px' },
    { label: 'Extra Large', value: '32px' },
    { label: 'Huge', value: '48px' }
  ];

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    try {
      document.execCommand('fontSize', false, '7');
      const fontElements = document.querySelectorAll('font[size="7"]');
      fontElements.forEach(element => {
        element.removeAttribute('size');
        (element as HTMLElement).style.fontSize = size;
      });
    } catch {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = size;
        try {
          range.surroundContents(span);
        } catch {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    }
  };

  const getCurrentSizeLabel = () => {
    const currentSize = fontSizes.find(size => size.value === selectedSize);
    return currentSize ? currentSize.label : 'Normal';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          title="Font Size"
        >
          <Type className="h-4 w-4 mr-1" />
          <span className="text-xs">{getCurrentSizeLabel()}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-32 bg-[#27202C] border-white/10 text-white z-50"
      >
        {fontSizes.map((size) => (
          <DropdownMenuItem
            key={size.value}
            onClick={() => handleSizeChange(size.value)}
            className={cn(
              "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10",
              selectedSize === size.value && "bg-white/20 text-white"
            )}
          >
            <span className="text-sm" style={{ fontSize: size.value }}>
              {size.label}
            </span>
            {selectedSize === size.value && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControls;
