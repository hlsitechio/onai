import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Typography from '@tiptap/extension-typography';
import { useStylusDetection } from '@/hooks/useStylusDetection';
import { useCameraOCR } from '@/hooks/useCameraOCR';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PenTool, Type } from 'lucide-react';
import HandwritingCanvas from './HandwritingCanvas';
import OCRCameraCapture from '../ocr/components/OCRCameraCapture';
import OptimizedToolbar from './toolbar/OptimizedToolbar';

interface OptimizedTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const OptimizedTiptapEditor: React.FC<OptimizedTiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'handwriting'>('text');
  const { hasStylus, isUsingStylus } = useStylusDetection();
  const { toast } = useToast();

  // Camera OCR functionality
  const {
    isCameraOpen,
    isProcessing: isCameraProcessing,
    ocrProgress,
    openCamera,
    closeCamera,
    handlePhotoCapture
  } = useCameraOCR();

  // Enhanced editor setup with Typography extension and improved configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
      Typography.configure({
        openDoubleQuote: '"',
        closeDoubleQuote: '"',
        openSingleQuote: '\'',
        closeSingleQuote: '\'',
        ellipsis: '…',
        emDash: '—',
        enDash: '–',
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-noteflow-400 underline hover:text-noteflow-300 cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 text-black px-1 rounded',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list not-prose',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item flex items-start gap-2',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
        allowBase64: true,
      }),
    ],
    content: content || '',
    autofocus: 'start',
    editorProps: {
      attributes: {
        class: 'prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] px-4 py-2 focus:outline-none bg-transparent text-white',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const textContent = editor.getText().trim();
      const hasRealContent = textContent.length > 0 && textContent !== '';
      
      if (hasRealContent || html !== '<p></p>') {
        setContent(html);
      }
    },
    onCreate: ({ editor }) => {
      console.log('Enhanced Tiptap editor created with Typography support');
    },
  });

  // Auto-switch to handwriting mode when stylus is detected
  useEffect(() => {
    if (isUsingStylus && inputMode === 'text') {
      setInputMode('handwriting');
    }
  }, [isUsingStylus, inputMode]);

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleHandwritingComplete = (handwrittenText: string) => {
    if (editor) {
      const handwritingHTML = `<div class="handwritten-content" style="border: 1px dashed #666; padding: 12px; margin: 12px 0; border-radius: 8px; background: rgba(120, 60, 255, 0.1);">
        <div style="font-size: 12px; color: #999; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
          <span>✍️</span>
          <span>Handwritten content</span>
        </div>
        <div>${handwrittenText || '[Handwritten content - processing...]'}</div>
      </div>`;
      
      editor.commands.insertContent(handwritingHTML);
    }
  };

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center bg-black/20 rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-6 h-6 border-2 border-noteflow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">Loading enhanced editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        {!isFocusMode && (
          <div className="flex items-center justify-between border-b border-white/10 p-2">
            <OptimizedToolbar 
              editor={editor} 
              onCameraOCRClick={openCamera}
              isCameraOCRProcessing={isCameraProcessing}
              characterCount={editor.storage.characterCount.characters()}
              characterLimit={50000}
            />
            
            {hasStylus && (
              <div className="flex space-x-2 ml-4">
                <Button
                  variant={inputMode === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('text')}
                  className="flex items-center space-x-1"
                >
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">Text</span>
                </Button>
                <Button
                  variant={inputMode === 'handwriting' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('handwriting')}
                  className="flex items-center space-x-1"
                >
                  <PenTool className="h-4 w-4" />
                  <span className="hidden sm:inline">Pen</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {inputMode === 'text' ? (
          <div className="flex-1 relative overflow-hidden editor-wrapper bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
            <EditorContent 
              editor={editor} 
              className="h-full overflow-y-auto focus-within:outline-none"
            />
            
            {/* Enhanced Character Count Display */}
            <div className="absolute bottom-2 right-4 text-xs text-gray-400 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              {editor.storage.characterCount.characters()}/{50000} characters
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4">
            <HandwritingCanvas
              onTextExtracted={handleHandwritingComplete}
              className="h-full max-w-full"
              width={1000}
              height={600}
            />
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setInputMode('text')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Type className="h-4 w-4 mr-2" />
                Switch to text editor
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Camera OCR Modal */}
      {isCameraOpen && (
        <OCRCameraCapture
          key="camera-capture" 
          onPhotoCapture={handlePhotoCapture}
          onClose={closeCamera}
          isProcessing={isCameraProcessing}
          ocrProgress={ocrProgress}
        />
      )}
    </div>
  );
};

export default OptimizedTiptapEditor;
