
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PenTool, Type } from 'lucide-react';
import AnimatedPlaceholder from '../editor/AnimatedPlaceholder';
import HandwritingCanvas from '../editor/HandwritingCanvas';
import { useStylusDetection } from '@/hooks/useStylusDetection';

interface MobileEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode: boolean;
  placeholder?: string;
}

const MobileEditor: React.FC<MobileEditorProps> = ({
  content,
  setContent,
  isFocusMode,
  placeholder = "Start writing your note..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [inputMode, setInputMode] = useState<'text' | 'handwriting'>('text');
  const { hasStylus, isUsingStylus } = useStylusDetection();

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    // Auto-switch to handwriting mode when stylus is detected
    if (isUsingStylus && inputMode === 'text') {
      setInputMode('handwriting');
    }
  }, [isUsingStylus, inputMode]);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default tab behavior and insert spaces instead
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
  };

  const handleHandwritingComplete = (handwrittenText: string) => {
    // Insert handwritten content as a special div
    const handwritingDiv = `<div class="handwritten-content" style="border: 1px dashed #666; padding: 10px; margin: 10px 0; border-radius: 8px; background: rgba(255,255,255,0.05);">
      <div style="font-size: 12px; color: #999; margin-bottom: 5px;">✍️ Handwritten content</div>
      <div>${handwrittenText || '[Handwritten content - processing...]'}</div>
    </div>`;
    
    const newContent = content + handwritingDiv;
    setContent(newContent);
  };

  return (
    <div className={cn(
      "flex-1 overflow-hidden relative flex flex-col",
      isFocusMode ? "min-h-[calc(100vh-120px)]" : "min-h-[calc(100vh-200px)]"
    )}>
      {/* Input Mode Toggle - only show if stylus is available */}
      {hasStylus && (
        <div className="flex p-2 space-x-2 border-b border-white/10">
          <Button
            variant={inputMode === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setInputMode('text')}
            className="flex items-center space-x-2"
          >
            <Type className="h-4 w-4" />
            <span>Text</span>
          </Button>
          <Button
            variant={inputMode === 'handwriting' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setInputMode('handwriting')}
            className="flex items-center space-x-2"
          >
            <PenTool className="h-4 w-4" />
            <span>Handwriting</span>
          </Button>
        </div>
      )}

      {inputMode === 'text' ? (
        <>
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 w-full p-6 bg-transparent text-white resize-none border-none outline-none overflow-y-auto",
              "text-base leading-normal",
              "touch-manipulation",
              "[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:leading-tight",
              "[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:leading-tight", 
              "[&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:leading-tight",
              "[&>p]:mb-2 [&>p]:leading-normal",
              "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-3",
              "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-3",
              "[&>li]:mb-0.5 [&>li]:leading-normal",
              "[&>blockquote]:border-l-4 [&>blockquote]:border-noteflow-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3",
              "[&>code]:bg-white/10 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm",
              "[&>pre]:bg-white/5 [&>pre]:p-4 [&>pre]:rounded [&>pre]:my-3 [&>pre]:overflow-x-auto",
              // Add highlighting styles for mobile editor
              "[&>.highlight]:bg-yellow-200 [&>.highlight]:text-black [&>.highlight]:px-1 [&>.highlight]:rounded",
              "focus:bg-white/5 transition-colors duration-200",
              // Mobile-specific optimizations
              "select-text",
              "-webkit-touch-callout-default",
              "break-words"
            )}
            data-placeholder=""
            style={{
              WebkitUserSelect: 'text',
              userSelect: 'text',
              lineHeight: '1.4'
            }}
            suppressContentEditableWarning={true}
          />
          
          {/* Animated placeholder */}
          <AnimatedPlaceholder isVisible={!content} />
          
          {/* Static tip below the animated placeholder */}
          {!content && (
            <div className="absolute top-20 left-6 text-slate-500 pointer-events-none text-sm select-none opacity-70">
              💡 Tip: {hasStylus ? 'Use your stylus to switch to handwriting mode, or ' : ''}Select text and use AI actions, or press Ctrl+Shift+A for the AI agent
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 p-4">
          <HandwritingCanvas
            onTextExtracted={handleHandwritingComplete}
            className="h-full"
            width={800}
            height={400}
          />
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setInputMode('text')}
              className="text-white border-white/20"
            >
              Switch back to text input
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileEditor;
