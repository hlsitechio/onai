
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Camera, Link, Image, Highlighter, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptimizedToolbarProps {
  onCameraOCRClick: () => void;
  isCameraOCRProcessing: boolean;
  characterCount: number;
  characterLimit: number;
}

const OptimizedToolbar: React.FC<OptimizedToolbarProps> = ({
  onCameraOCRClick,
  isCameraOCRProcessing,
  characterCount,
  characterLimit
}) => {
  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false);
  };

  const handleStrikethrough = () => {
    document.execCommand('strikeThrough', false);
  };

  const handleCode = () => {
    document.execCommand('formatBlock', false, 'pre');
  };

  const handleHighlight = () => {
    document.execCommand('hiliteColor', false, 'yellow');
  };

  const handleHeading = (level: number) => {
    document.execCommand('formatBlock', false, `h${level}`);
  };

  const handleAlignLeft = () => {
    document.execCommand('justifyLeft', false);
  };

  const handleAlignCenter = () => {
    document.execCommand('justifyCenter', false);
  };

  const handleAlignRight = () => {
    document.execCommand('justifyRight', false);
  };

  const handleAlignJustify = () => {
    document.execCommand('justifyFull', false);
  };

  const handleUndo = () => {
    document.execCommand('undo', false);
  };

  const handleRedo = () => {
    document.execCommand('redo', false);
  };

  const handleBulletList = () => {
    document.execCommand('insertUnorderedList', false);
  };

  const handleNumberedList = () => {
    document.execCommand('insertOrderedList', false);
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      const text = window.prompt('Enter link text:') || url;
      document.execCommand('insertHTML', false, `<a href="${url}">${text}</a>`);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (url) {
            document.execCommand('insertHTML', false, `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleClearFormatting = () => {
    document.execCommand('removeFormat', false);
  };

  const formatButtons = [
    {
      icon: Bold,
      onClick: handleBold,
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: Italic,
      onClick: handleItalic,
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: Underline,
      onClick: handleUnderline,
      title: 'Underline (Ctrl+U)',
    },
    {
      icon: Strikethrough,
      onClick: handleStrikethrough,
      title: 'Strikethrough',
    },
    {
      icon: Code,
      onClick: handleCode,
      title: 'Code Block',
    },
    {
      icon: Highlighter,
      onClick: handleHighlight,
      title: 'Highlight',
    },
  ];

  const headingButtons = [
    {
      icon: Heading1,
      onClick: () => handleHeading(1),
      title: 'Heading 1',
    },
    {
      icon: Heading2,
      onClick: () => handleHeading(2),
      title: 'Heading 2',
    },
    {
      icon: Heading3,
      onClick: () => handleHeading(3),
      title: 'Heading 3',
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      onClick: handleAlignLeft,
      title: 'Align Left',
    },
    {
      icon: AlignCenter,
      onClick: handleAlignCenter,
      title: 'Align Center',
    },
    {
      icon: AlignRight,
      onClick: handleAlignRight,
      title: 'Align Right',
    },
    {
      icon: AlignJustify,
      onClick: handleAlignJustify,
      title: 'Justify',
    },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap toolbar bg-[#27202C] rounded-lg p-2">
      {/* Format controls */}
      <div className="flex items-center gap-1">
        {formatButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onMouseDown={(e) => {
                e.preventDefault();
                button.onClick();
              }}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Heading controls */}
      <div className="flex items-center gap-1">
        {headingButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onMouseDown={(e) => {
                e.preventDefault();
                button.onClick();
              }}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* List controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            handleBulletList();
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Bullet List"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            handleNumberedList();
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Numbered List"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10 hidden md:block" />

      {/* Alignment controls - hidden on mobile */}
      <div className="hidden md:flex items-center gap-1">
        {alignmentButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onMouseDown={(e) => {
                e.preventDefault();
                button.onClick();
              }}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Insert controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLinkInsert}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onCameraOCRClick}
          disabled={isCameraOCRProcessing}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Camera OCR"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Clear formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFormatting}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Clear Formatting"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* History controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Character count */}
      <div className="ml-auto text-xs text-gray-400 hidden sm:block">
        {characterCount}/{characterLimit}
      </div>
    </div>
  );
};

export default OptimizedToolbar;
