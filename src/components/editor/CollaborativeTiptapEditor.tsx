
import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
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
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom, useSelf } from '@/lib/liveblocks';
import { generateUserInfo } from '@/lib/liveblocks';
import OptimizedToolbar from './toolbar/OptimizedToolbar';
import LiveCursors from './LiveCursors';
import UserAwareness from './UserAwareness';

interface CollaborativeTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  roomId: string;
}

const CollaborativeTiptapEditor: React.FC<CollaborativeTiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false,
  roomId
}) => {
  const room = useRoom();

  // Create Yjs document and provider
  const { yDoc, yProvider } = useMemo(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    return { yDoc, yProvider };
  }, [room]);

  // Initialize user info if not set
  useEffect(() => {
    const newUserInfo = generateUserInfo();
    room.updatePresence({ user: newUserInfo });
  }, [room]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the default history extension since we're using collaboration
        history: false,
      }),
      Collaboration.configure({
        document: yDoc,
      }),
      CollaborationCursor.configure({
        provider: yProvider,
        user: generateUserInfo(),
      }),
      Placeholder.configure({
        placeholder: 'Start writing together...',
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
      console.log('Collaborative Tiptap editor created');
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (yProvider) {
        yProvider.destroy();
      }
      if (yDoc) {
        yDoc.destroy();
      }
      if (editor) {
        editor.destroy();
      }
    };
  }, [yProvider, yDoc, editor]);

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center bg-black/20 rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-6 h-6 border-2 border-noteflow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">Connecting to collaborative session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex">
      {/* User Awareness */}
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
          </div>
        )}

        <div className="flex-1 relative overflow-hidden editor-wrapper bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
          <EditorContent 
            editor={editor} 
            className="h-full overflow-y-auto focus-within:outline-none"
          />
          
          {/* Live Cursors */}
          <LiveCursors editor={editor} />
          
          {/* Enhanced Character Count Display */}
          <div className="absolute bottom-2 right-4 text-xs text-gray-400 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            {editor.storage.characterCount.characters()}/{50000} characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeTiptapEditor;
