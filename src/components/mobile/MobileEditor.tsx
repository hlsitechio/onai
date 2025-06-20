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
  return;
};
export default MobileEditor;