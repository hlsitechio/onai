// EditorContainer - Enhanced ONAI Editor Component with Modern Design
// File: src/components/editor/EditorContainer.jsx

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  AlertTriangle, 
  RefreshCw,
  Type,
  Edit3,
  Save,
  Clock,
  Sparkles,
  Brain,
  Zap,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  MoreHorizontal
} from 'lucide-react'
import TiptapEditor from './TiptapEditor'
import TextAreaEditor from './TextAreaEditor'

const EditorContainer = ({ 
  note,
  onContentChange,
  onSave,
  onMetadataChange,
  focusMode = false,
  onToggleFocusMode,
  readOnly = false,
  className = ''
}) => {
  const [editorType, setEditorType] = useState('tiptap')
  const [editorError, setEditorError] = useState(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null)
  const [showStats, setShowStats] = useState(true)

  // Auto-save configuration
  const AUTO_SAVE_DELAY = 2000
  const AUTO_SAVE_ENABLED = true

  // Initialize editor type from localStorage
  useEffect(() => {
    const savedEditorType = localStorage.getItem('onai-notes-editor-type')
    if (savedEditorType && ['tiptap', 'textarea'].includes(savedEditorType)) {
      setEditorType(savedEditorType)
    }
  }, [])

  // Handle content changes with auto-save
  const handleContentChange = useCallback((content, metadata = {}) => {
    setIsDirty(true)
    onContentChange?.(content, metadata)
    onMetadataChange?.(metadata)

    // Clear existing auto-save timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }

    // Set new auto-save timeout
    if (AUTO_SAVE_ENABLED && !readOnly) {
      const timeout = setTimeout(async () => {
        try {
          setIsAutoSaving(true)
          await onSave?.(content, metadata)
          setLastSaved(new Date())
          setIsDirty(false)
        } catch (error) {
          console.error('Auto-save failed:', error)
        } finally {
          setIsAutoSaving(false)
        }
      }, AUTO_SAVE_DELAY)
      
      setAutoSaveTimeout(timeout)
    }
  }, [onContentChange, onMetadataChange, onSave, autoSaveTimeout, readOnly])

  // Manual save
  const handleManualSave = useCallback(async () => {
    if (!isDirty || readOnly) return

    try {
      setIsAutoSaving(true)
      await onSave?.(note?.content, note?.metadata)
      setLastSaved(new Date())
      setIsDirty(false)
    } catch (error) {
      console.error('Manual save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [isDirty, readOnly, onSave, note])

  // Switch editor type
  const switchEditorType = useCallback((newType) => {
    setEditorType(newType)
    localStorage.setItem('onai-notes-editor-type', newType)
    setEditorError(null)
  }, [])

  // Error boundary for TiptapEditor
  const TiptapEditorWithErrorBoundary = useMemo(() => {
    try {
      return (
        <TiptapEditor
          content={note?.content || ''}
          onContentChange={handleContentChange}
          onSave={handleManualSave}
          placeholder="Start writing your note..."
          focusMode={focusMode}
          readOnly={readOnly}
          className="h-full"
        />
      )
    } catch (error) {
      setEditorError(error)
      return null
    }
  }, [note?.content, handleContentChange, handleManualSave, focusMode, readOnly])

  // Fallback to TextAreaEditor if TiptapEditor fails
  useEffect(() => {
    if (editorError && editorType === 'tiptap') {
      console.warn('TiptapEditor failed, falling back to TextAreaEditor:', editorError)
      setEditorType('textarea')
    }
  }, [editorError, editorType])

  // Format last saved time
  const formatLastSaved = useCallback((date) => {
    if (!date) return 'Never'
    
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleManualSave()
      }
      
      // Ctrl/Cmd + Shift + E for editor switch
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        switchEditorType(editorType === 'tiptap' ? 'textarea' : 'tiptap')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleManualSave, switchEditorType, editorType])

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
    }
  }, [autoSaveTimeout])

  return (
    <div className={`editor-container flex flex-col h-full ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : ''}`}>
      {/* Editor Header */}
      {!focusMode && (
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Badge 
              variant={editorType === 'tiptap' ? 'default' : 'secondary'} 
              className={`text-xs ${
                editorType === 'tiptap' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-black/30 border-white/20 text-gray-300'
              }`}
            >
              {editorType === 'tiptap' ? (
                <>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Rich Editor
                </>
              ) : (
                <>
                  <Type className="h-3 w-3 mr-1" />
                  Markdown Editor
                </>
              )}
            </Badge>
            
            {isDirty && (
              <Badge variant="outline" className="text-xs bg-orange-500/20 border-orange-500/30 text-orange-300">
                <Clock className="h-3 w-3 mr-1" />
                Unsaved
              </Badge>
            )}
            
            {isAutoSaving && (
              <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-300">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </Badge>
            )}

            {note?.metadata?.ai_generated && (
              <Badge variant="outline" className="text-xs bg-purple-500/20 border-purple-500/30 text-purple-300">
                <Brain className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Last saved indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Saved {formatLastSaved(lastSaved)}</span>
            </div>

            {/* Stats toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              title="Toggle Stats"
            >
              {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            {/* Manual save button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSave}
              disabled={!isDirty || isAutoSaving || readOnly}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
              title="Save (Ctrl+S)"
            >
              <Save className="h-4 w-4" />
            </Button>

            {/* Editor type switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchEditorType(editorType === 'tiptap' ? 'textarea' : 'tiptap')}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              title="Switch Editor (Ctrl+Shift+E)"
            >
              {editorType === 'tiptap' ? <Type className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>

            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              title="Fullscreen (F11)"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {editorError && editorType === 'textarea' && (
        <Alert className="m-4 bg-red-500/10 border-red-500/30 text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Rich text editor failed to load. Using markdown editor as fallback.
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => {
                setEditorError(null)
                setEditorType('tiptap')
              }}
              className="ml-2 p-0 h-auto text-red-300 hover:text-red-200"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Editor Content */}
      <div className="flex-1 editor-scroll bg-black/10">
        {editorType === 'tiptap' && !editorError ? (
          TiptapEditorWithErrorBoundary
        ) : (
          <TextAreaEditor
            content={note?.content || ''}
            onContentChange={handleContentChange}
            onSave={handleManualSave}
            placeholder="Start writing your note..."
            focusMode={focusMode}
            readOnly={readOnly}
            className="h-full"
          />
        )}
      </div>

      {/* Editor Footer */}
      {!focusMode && showStats && (
        <div className="border-t border-white/10 p-3 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-yellow-400" />
                {note?.metadata?.wordCount || 0} words
              </span>
              <span>{note?.metadata?.characterCount || 0} characters</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {note?.metadata?.readingTime || 0} min read
              </span>
              {note?.metadata?.language && (
                <span className="uppercase">{note.metadata.language}</span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                {editorType === 'tiptap' ? (
                  <>
                    <Edit3 className="h-3 w-3" />
                    Rich text editing
                  </>
                ) : (
                  <>
                    <Type className="h-3 w-3" />
                    Markdown supported
                  </>
                )}
              </span>
              {AUTO_SAVE_ENABLED && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Auto-save enabled
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-400" />
                ONAI powered
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorContainer

