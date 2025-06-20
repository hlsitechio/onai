
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
  const {
    hasStylus,
    isUsingStylus
  } = useStylusDetection();

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
      "flex-1 flex flex-col relative",
      isFocusMode && "focus-mode"
    )}>
      {/* Input mode toggle */}
      {hasStylus && (
        <div className="flex items-center justify-center p-2 border-b border-border bg-background/50">
          <div className="flex rounded-lg bg-muted p-1">
            <Button
              variant={inputMode === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInputMode('text')}
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs">Text</span>
            </Button>
            <Button
              variant={inputMode === 'handwriting' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInputMode('handwriting')}
              className="flex items-center gap-2"
            >
              <PenTool className="h-4 w-4" />
              <span className="text-xs">Write</span>
            </Button>
          </div>
        </div>
      )}

      {/* Editor content */}
      <div className="flex-1 relative overflow-hidden">
        {inputMode === 'text' ? (
          <div className="h-full flex flex-col">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex-1 p-4 outline-none bg-transparent",
                "prose prose-sm max-w-none dark:prose-invert",
                "focus:ring-0 focus:outline-none",
                !content && "text-muted-foreground"
              )}
              style={{
                minHeight: '100%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
              suppressContentEditableWarning={true}
            />
            {!content && (
              <div className="absolute top-4 left-4 pointer-events-none">
                <AnimatedPlaceholder text={placeholder} />
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            <HandwritingCanvas
              onHandwritingComplete={handleHandwritingComplete}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileEditor;
