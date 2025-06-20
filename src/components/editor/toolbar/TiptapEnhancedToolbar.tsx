
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Undo,
  Redo,
  Sparkles,
  ScanText,
  Upload
} from 'lucide-react';
import OCRPopup from '../../ocr/OCRPopup';
import OCRCameraButton from '../../ocr/OCRCameraButton';
import { cn } from '@/lib/utils';

interface TiptapEnhancedToolbarProps {
  editor: Editor;
  onAIClick?: () => void;
  onCameraOCRClick?: () => void;
  isCameraOCRProcessing?: boolean;
}

const TiptapEnhancedToolbar: React.FC<TiptapEnhancedToolbarProps> = ({ 
  editor, 
  onAIClick,
  onCameraOCRClick,
  isCameraOCRProcessing = false
}) => {
  const [isOCROpen, setIsOCROpen] = useState(false);

  const handleTextFormatting = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'undo':
        editor.chain().focus().undo().run();
        break;
      case 'redo':
        editor.chain().focus().redo().run();
        break;
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleOCRTextExtracted = (text: string) => {
    if (text && text.trim()) {
      editor.chain().focus().insertContent(text).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false 
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10",
        isActive && "bg-white/10 text-white"
      )}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex items-center gap-1 flex-wrap p-1">
      {/* History */}
      <ToolbarButton
        onClick={() => handleTextFormatting('undo')}
        title="Undo"
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('redo')}
        title="Redo"
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => handleTextFormatting('bold')}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('italic')}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('underline')}
        isActive={editor.isActive('underline')}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('strike')}
        isActive={editor.isActive('strike')}
        title="Strikethrough"  
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => handleTextFormatting('h1')}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('h2')}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('h3')}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Lists and Blocks */}
      <ToolbarButton
        onClick={() => handleTextFormatting('bulletList')}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('orderedList')}
        isActive={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('blockquote')}
        isActive={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleTextFormatting('code')}
        isActive={editor.isActive('code')}
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Insert */}
      <ToolbarButton onClick={insertLink} title="Insert Link">
        <Link className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={insertImage} title="Insert Image">
        <Image className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* OCR Tools */}
      <ToolbarButton
        onClick={() => setIsOCROpen(true)}
        title="OCR - Extract Text from Image"
      >
        <ScanText className="h-4 w-4" />
      </ToolbarButton>

      {onCameraOCRClick && (
        <OCRCameraButton
          onClick={onCameraOCRClick}
          isProcessing={isCameraOCRProcessing}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10"
        />
      )}

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* AI */}
      {onAIClick && (
        <ToolbarButton onClick={onAIClick} title="AI Assistant">
          <Sparkles className="h-4 w-4" />
        </ToolbarButton>
      )}

      {/* OCR Popup */}
      <OCRPopup
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
        onTextExtracted={handleOCRTextExtracted}
      />
    </div>
  );
};

export default TiptapEnhancedToolbar;
