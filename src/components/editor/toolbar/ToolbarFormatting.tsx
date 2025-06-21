
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import FormatControls from './controls/FormatControls';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToolbarActions } from '@/hooks/useToolbarActions';

interface ToolbarFormattingProps {
  editor?: any;
}

const ToolbarFormatting: React.FC<ToolbarFormattingProps> = ({ editor }) => {
  const { execCommand } = useToolbarActions(editor);

  // Heading options
  const headingOptions = [
    { label: 'Normal Text', value: 'p', command: () => execCommand('formatBlock', 'p') },
    { label: 'Heading 1', value: 'h1', command: () => execCommand('formatBlock', 'h1') },
    { label: 'Heading 2', value: 'h2', command: () => execCommand('formatBlock', 'h2') },
    { label: 'Heading 3', value: 'h3', command: () => execCommand('formatBlock', 'h3') },
    { label: 'Heading 4', value: 'h4', command: () => execCommand('formatBlock', 'h4') },
    { label: 'Heading 5', value: 'h5', command: () => execCommand('formatBlock', 'h5') },
    { label: 'Heading 6', value: 'h6', command: () => execCommand('formatBlock', 'h6') },
  ];

  // List options
  const listOptions = [
    { label: 'Bullet List', command: () => execCommand('insertUnorderedList') },
    { label: 'Numbered List', command: () => execCommand('insertOrderedList') },
  ];

  // Alignment options
  const alignmentOptions = [
    { label: 'Align Left', command: () => execCommand('justifyLeft') },
    { label: 'Align Center', command: () => execCommand('justifyCenter') },
    { label: 'Align Right', command: () => execCommand('justifyRight') },
    { label: 'Justify', command: () => execCommand('justifyFull') },
  ];

  // Color options
  const colorOptions = [
    { label: 'Black', value: '#000000' },
    { label: 'White', value: '#ffffff' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Yellow', value: '#eab308' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Pink', value: '#ec4899' },
  ];

  return (
    <div className="flex items-center gap-3">
      {/* Format Controls */}
      <FormatControls editor={editor} />

      {/* Headings dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
          >
            Headings
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
          {headingOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={option.command}
              className="hover:bg-white/10 focus:bg-white/10"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Lists dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
          >
            Lists
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
          {listOptions.map((option, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={option.command}
              className="hover:bg-white/10 focus:bg-white/10"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alignment dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
          >
            Align
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
          {alignmentOptions.map((option, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={option.command}
              className="hover:bg-white/10 focus:bg-white/10"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text Color dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
          >
            Color
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
          {colorOptions.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => execCommand('foreColor', color.value)}
              className="hover:bg-white/10 focus:bg-white/10 flex items-center gap-2"
            >
              <div 
                className="w-4 h-4 rounded border border-white/20" 
                style={{ backgroundColor: color.value }}
              />
              {color.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Additional controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('createLink', prompt('Enter URL:'))}
          className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
          title="Insert Link"
        >
          🔗
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo')}
          className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
          title="Undo"
        >
          ↶
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo')}
          className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
          title="Redo"
        >
          ↷
        </Button>
      </div>
    </div>
  );
};

export default ToolbarFormatting;
