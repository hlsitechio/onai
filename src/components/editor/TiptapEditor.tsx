import React, { useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { cn } from '@/lib/utils'
import { setTiptapEditor } from '../toolbar/utils/editorUtils'

// Define toolbar button component
const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false,
  children 
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  disabled?: boolean,
  children: React.ReactNode 
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-1.5 rounded text-white/80 hover:text-white transition-colors",
      "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20",
      isActive && "text-noteflow-400 bg-white/5"
    )}
  >
    {children}
  </button>
)

interface TiptapEditorProps {
  content: string
  setContent: (content: string) => void
  isFocusMode: boolean
  onSave: () => void
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode,
  onSave,
}) => {
  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing something...',
      }),
      Highlight,
      Typography,
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      Image,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      // Use editor.getHTML() to get the content as HTML
      setContent(editor.getHTML())
    },
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: cn(
          "outline-none w-full h-full px-6 py-6 text-lg leading-relaxed text-white",
          "prose prose-invert max-w-none",
          "focus:outline-none",
          "[&>*]:mb-4 [&>*:last-child]:mb-0",
          "[&_p]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white",
          "[&_ul]:text-white [&_ol]:text-white [&_li]:text-white",
          "[&_strong]:text-white [&_em]:text-white",
          isFocusMode ? "bg-black/70" : "bg-black/30"
        ),
      },
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [editor, content])
  
  // Register the editor instance with our utility functions
  useEffect(() => {
    if (editor) {
      setTiptapEditor(editor)
    }
  }, [editor])

  // Handle Ctrl+S save shortcut
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      onSave()
    }
  }, [onSave])

  // Add event listener for keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  if (!editor) {
    return <div className="w-full h-full flex items-center justify-center text-white/50">Loading editor...</div>
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Floating formatting menu that appears when text is selected */}
      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ 
          duration: 150,
          animation: 'shift-away',
        }}
        className="bg-gray-800 rounded-md shadow-lg border border-white/10 flex p-1"
      >
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          isActive={editor.isActive('highlight')}
        >
          <span className="bg-yellow-200 text-black px-0.5">H</span>
        </ToolbarButton>
        
        <div className="h-4 w-px bg-white/20 mx-1"></div>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <span className="font-bold">H1</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <span className="font-bold">H2</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive('heading', { level: 3 })}
        >
          <span className="font-bold">H3</span>
        </ToolbarButton>
        
        <div className="h-4 w-px bg-white/20 mx-1"></div>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
        >
          <span className="font-mono">•</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
        >
          <span className="font-mono">1.</span>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          isActive={editor.isActive('codeBlock')}
        >
          <span className="font-mono">{`{}`}</span>
        </ToolbarButton>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
