// TextAreaEditor - Lightweight Fallback Editor Component
// File: src/components/editor/TextAreaEditor.jsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Bold, 
  Italic, 
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Eye,
  Edit,
  Type,
  Maximize,
  Minimize
} from 'lucide-react'

const TextAreaEditor = ({ 
  content = '', 
  onContentChange, 
  onSave,
  placeholder = 'Start writing your note...',
  focusMode = false,
  readOnly = false,
  className = ''
}) => {
  const [text, setText] = useState(content)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [history, setHistory] = useState([content])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const textareaRef = useRef(null)

  // Update text when content prop changes
  useEffect(() => {
    if (content !== text) {
      setText(content)
    }
  }, [content])

  // Calculate statistics
  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split('\n').length,
    paragraphs: text.split(/\n\s*\n/).filter(p => p.trim()).length,
    readingTime: Math.ceil((text.trim().split(/\s+/).length || 0) / 200)
  }

  // Handle text change with history tracking
  const handleTextChange = useCallback((newText) => {
    setText(newText)
    
    // Add to history if significant change
    if (Math.abs(newText.length - text.length) > 10 || 
        Date.now() - (history.lastUpdate || 0) > 5000) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newText)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      newHistory.lastUpdate = Date.now()
    }

    // Call parent callback
    onContentChange?.(newText, {
      text: newText,
      wordCount: stats.words,
      characterCount: stats.characters,
      readingTime: stats.readingTime
    })
  }, [text, history, historyIndex, onContentChange, stats.words, stats.characters, stats.readingTime])

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setText(history[newIndex])
    }
  }, [history, historyIndex])

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setText(history[newIndex])
    }
  }, [history, historyIndex])

  // Get current selection
  const getCurrentSelection = useCallback(() => {
    if (textareaRef.current) {
      return {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      }
    }
    return { start: 0, end: 0 }
  }, [])

  // Insert text at cursor position
  const insertText = useCallback((insertString, selectInserted = false) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { start, end } = getCurrentSelection()
    const newText = text.substring(0, start) + insertString + text.substring(end)
    
    handleTextChange(newText)
    
    // Set cursor position after insert
    setTimeout(() => {
      if (selectInserted) {
        textarea.setSelectionRange(start, start + insertString.length)
      } else {
        textarea.setSelectionRange(start + insertString.length, start + insertString.length)
      }
      textarea.focus()
    }, 0)
  }, [text, getCurrentSelection, handleTextChange])

  // Wrap selected text
  const wrapText = useCallback((before, after = before) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { start, end } = getCurrentSelection()
    const selectedText = text.substring(start, end)
    const wrappedText = before + selectedText + after
    
    const newText = text.substring(0, start) + wrappedText + text.substring(end)
    handleTextChange(newText)
    
    setTimeout(() => {
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      textarea.focus()
    }, 0)
  }, [text, getCurrentSelection, handleTextChange])

  // Format functions
  const formatBold = () => wrapText('**')
  const formatItalic = () => wrapText('*')
  const formatCode = () => wrapText('`')
  
  const formatHeading = (level) => {
    const prefix = '#'.repeat(level) + ' '
    const { start } = getCurrentSelection()
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const lineEnd = text.indexOf('\n', start)
    const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd)
    
    // Remove existing heading markers
    const cleanLine = currentLine.replace(/^#+\s*/, '')
    const newLine = prefix + cleanLine
    
    const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd === -1 ? text.length : lineEnd)
    handleTextChange(newText)
  }

  const formatList = (ordered = false) => {
    const { start } = getCurrentSelection()
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const prefix = ordered ? '1. ' : '- '
    
    const newText = text.substring(0, lineStart) + prefix + text.substring(lineStart)
    handleTextChange(newText)
  }

  const formatQuote = () => {
    const { start } = getCurrentSelection()
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const newText = text.substring(0, lineStart) + '> ' + text.substring(lineStart)
    handleTextChange(newText)
  }

  // Render markdown preview
  const renderPreview = () => {
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n/gim, '<br>')
  }

  const ToolbarButton = ({ onClick, disabled, children, title }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  return (
    <div className={`textarea-editor ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {!readOnly && !focusMode && (
        <div className="border-b border-border p-2 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Text Formatting */}
              <ToolbarButton onClick={formatBold} title="Bold (**text**)">
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              
              <ToolbarButton onClick={formatItalic} title="Italic (*text*)">
                <Italic className="h-4 w-4" />
              </ToolbarButton>

              <Separator orientation="vertical" className="h-6" />

              {/* Lists and Quotes */}
              <ToolbarButton onClick={() => formatList(false)} title="Bullet List (- item)">
                <List className="h-4 w-4" />
              </ToolbarButton>
              
              <ToolbarButton onClick={() => formatList(true)} title="Numbered List (1. item)">
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              
              <ToolbarButton onClick={formatQuote} title="Quote (> text)">
                <Quote className="h-4 w-4" />
              </ToolbarButton>

              <Separator orientation="vertical" className="h-6" />

              {/* Undo/Redo */}
              <ToolbarButton 
                onClick={undo} 
                disabled={historyIndex <= 0}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </ToolbarButton>
              
              <ToolbarButton 
                onClick={redo} 
                disabled={historyIndex >= history.length - 1}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-1">
              {/* View Toggle */}
              <ToolbarButton 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
              >
                {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </ToolbarButton>

              {/* Fullscreen Toggle */}
              <ToolbarButton 
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </ToolbarButton>
            </div>
          </div>
        </div>
      )}

      <div className={`editor-content ${focusMode ? 'p-8' : 'p-4'} ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        {isPreviewMode ? (
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none min-h-[400px] p-4 border border-border rounded-md bg-muted/20"
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onSelect={(e) => {
              setSelectionStart(e.target.selectionStart)
              setSelectionEnd(e.target.selectionEnd)
            }}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full resize-none bg-transparent border-none outline-none text-base leading-relaxed font-mono ${
              isFullscreen ? 'flex-1' : 'min-h-[400px]'
            }`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }}
          />
        )}
      </div>

      {!readOnly && (
        <div className="border-t border-border p-2 bg-muted/50 text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {stats.characters} chars
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.words} words
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.lines} lines
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.readingTime} min read
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span>Markdown supported</span>
              <Type className="h-3 w-3" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextAreaEditor

