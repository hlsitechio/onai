
import React, { useEffect, useState } from 'react';
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
import { useRoom, useMyPresence, useOthers } from '@/lib/liveblocks';
import { generateUserInfo } from '@/lib/liveblocks';
import OptimizedToolbar from './toolbar/OptimizedToolbar';
import UserAwareness from './UserAwareness';

interface EnhancedTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  roomId: string;
}

const EnhancedTiptapEditor: React.FC<EnhancedTiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false,
  roomId
}) => {
  const room = useRoom();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [isTyping, setIsTyping] = useState(false);

  // Initialize user info
  useEffect(() => {
    const newUserInfo = generateUserInfo();
    updateMyPresence({ user: newUserInfo, cursor: null });
  }, [updateMyPresence]);

  // Track typing activity
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (isTyping) {
      updateMyPresence({ ...myPresence, isTyping: true });
      
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
        updateMyPresence({ ...myPresence, isTyping: false });
      }, 2000);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [isTyping, myPresence, updateMyPresence]);

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
        placeholder: 'Start writing with enhanced awareness...',
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
    editorProps: {
      attributes: {
        class: 'prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] px-4 py-2 focus:outline-none bg-transparent text-white',
      },
    },
    onUpdate: ({ editor }) => {
      setIsTyping(true);
      const html = editor.getHTML();
      const textContent = editor.getText().trim();
      const hasRealContent = textContent.length > 0 && textContent !== '';
      
      if (hasRealContent || html !== '<p></p>') {
        setContent(html);
      }
    },
    onCreate: ({ editor }) => {
      console.log('Enhanced Tiptap editor created with Liveblocks awareness');
    },
  });

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
      {/* User Awareness - shows who else is in the room */}
      <UserAwareness />
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        {!isFocusMode && (
          <div className="flex items-center justify-between border-b border-white/10 p-2">
            <OptimizedToolbar 
              editor={editor} 
              onCameraOCRClick={() => {}}
              isCameraOCRProcessing={false}
              characterCount={editor.storage.characterCount.characters()}
              characterLimit={50000}
            />
            
            {/* Activity indicator */}
            {others.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>{others.length} other{others.length !== 1 ? 's' : ''} online</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 relative overflow-hidden editor-wrapper bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
          <EditorContent 
            editor={editor} 
            className="h-full overflow-y-auto focus-within:outline-none"
          />
          
          {/* Enhanced Character Count Display */}
          <div className="absolute bottom-2 right-4 text-xs text-gray-400 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            {editor.storage.characterCount.characters()}/{50000} characters
            {isTyping && (
              <span className="ml-2 text-green-400">• typing</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTiptapEditor;
