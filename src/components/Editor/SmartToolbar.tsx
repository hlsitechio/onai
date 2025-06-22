
import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  ListOrdered, 
  Bot,
  Mic,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SpeechToText from './SpeechToText';
import OCRScreenCapture from './OCRScreenCapture';

interface SmartToolbarProps {
  onFormatClick: (formatId: string, event: React.MouseEvent) => void;
  onAIClick: () => void;
  onTextInsert?: (text: string) => void;
  activeFormats: Set<string>;
  selectedText: string;
}

const SmartToolbar: React.FC<SmartToolbarProps> = ({ 
  onFormatClick, 
  onAIClick, 
  onTextInsert,
  activeFormats,
  selectedText 
}) => {
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const [showOCR, setShowOCR] = useState(false);

  const handleTextReceived = (text: string) => {
    if (onTextInsert) {
      onTextInsert(text);
    }
  };

  const formatButtons = [
    { id: 'bold', icon: Bold, title: 'Bold (Ctrl+B)' },
    { id: 'italic', icon: Italic, title: 'Italic (Ctrl+I)' },
    { id: 'underline', icon: Underline, title: 'Underline (Ctrl+U)' },
    { id: 'code', icon: Code, title: 'Code (Ctrl+`)' },
  ];

  const blockButtons = [
    { id: 'heading-one', icon: Heading1, title: 'Heading 1' },
    { id: 'heading-two', icon: Heading2, title: 'Heading 2' },
    { id: 'block-quote', icon: Quote, title: 'Quote' },
    { id: 'bulleted-list', icon: List, title: 'Bullet List' },
    { id: 'numbered-list', icon: ListOrdered, title: 'Numbered List' },
  ];

  return (
    <>
      <div className="flex items-center gap-1 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-blue-200/50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-slate-600/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          {formatButtons.map(({ id, icon: Icon, title }) => (
            <Button
              key={id}
              variant={activeFormats.has(id) ? "default" : "ghost"}
              size="sm"
              title={title}
              onClick={(e) => onFormatClick(id, e)}
              className={`h-8 w-8 p-0 ${
                activeFormats.has(id) 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'hover:bg-blue-100 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-blue-200 dark:bg-slate-500" />

        {/* Block Formatting */}
        <div className="flex items-center gap-1">
          {blockButtons.map(({ id, icon: Icon, title }) => (
            <Button
              key={id}
              variant={activeFormats.has(id) ? "default" : "ghost"}
              size="sm"
              title={title}
              onClick={(e) => onFormatClick(id, e)}
              className={`h-8 w-8 p-0 ${
                activeFormats.has(id) 
                  ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700' 
                  : 'hover:bg-purple-100 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-purple-200 dark:bg-slate-500" />

        {/* Voice & OCR Tools */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            title="Speech to Text"
            onClick={() => setShowSpeechToText(true)}
            className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 hover:text-green-700 dark:hover:bg-slate-600 dark:text-green-400"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="OCR Screen Capture"
            onClick={() => setShowOCR(true)}
            className="h-8 w-8 p-0 hover:bg-purple-100 text-purple-600 hover:text-purple-700 dark:hover:bg-slate-600 dark:text-purple-400"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-green-200 dark:bg-slate-500" />

        {/* AI Assistant */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
              >
                <Bot className="w-4 h-4 mr-1" />
                AI Assistant
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 dark:bg-slate-800 dark:border-slate-600">
              <div className="space-y-2">
                <p className="text-sm font-medium dark:text-slate-200">AI Writing Assistant</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  {selectedText ? `Selected: "${selectedText.slice(0, 50)}..."` : 'Select text to get AI suggestions'}
                </p>
                <Button 
                  size="sm" 
                  onClick={onAIClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Open AI Assistant
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Speech to Text Modal */}
      <SpeechToText
        isVisible={showSpeechToText}
        onClose={() => setShowSpeechToText(false)}
        onTextReceived={handleTextReceived}
      />

      {/* OCR Screen Capture Modal */}
      <OCRScreenCapture
        isVisible={showOCR}
        onClose={() => setShowOCR(false)}
        onTextReceived={handleTextReceived}
      />
    </>
  );
};

export default SmartToolbar;
