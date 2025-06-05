// Enhanced NotesManager - Fixed Drag & Drop with Advanced State Management
// File: src/components/notes/NotesManager.jsx
// Comprehensive fix for drag & drop functionality with folder count updates

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { getSmartPreview } from '../../utils/templatePreview'
import { 
  Search, 
  Plus, 
  Star, 
  Share2, 
  Filter, 
  MoreHorizontal,
  Folder,
  FolderOpen,
  FileText,
  Calendar,
  Clock,
  Hash,
  X,
  Edit3,
  Check,
  Sparkles,
  Tag,
  Trash2,
  Archive,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

const NotesManager = ({ 
  notes = [], 
  folders = [], 
  currentNote, 
  onNoteSelect, 
  onNoteCreate, 
  onNoteUpdate,
  onNoteDelete,
  onFolderCreate,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('modified')
  const [expandedFolders, setExpandedFolders] = useState(new Set(['all']))
  const [draggedNote, setDraggedNote] = useState(null)
  const [dragOverFolder, setDragOverFolder] = useState(null)
  const [editingTitle, setEditingTitle] = useState(null)
  const [editingTitleValue, setEditingTitleValue] = useState('')
  const [showTagInput, setShowTagInput] = useState(null)
  const [newTag, setNewTag] = useState('')
  const [autoTagging, setAutoTagging] = useState(true)
  
  // Enhanced state management for drag & drop
  const [isDragging, setIsDragging] = useState(false)
  const [dragOperation, setDragOperation] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [operationFeedback, setOperationFeedback] = useState(null)

  const titleInputRef = useRef(null)
  const tagInputRef = useRef(null)
  const dragTimeoutRef = useRef(null)

  // Auto-tagging keywords
  const autoTagKeywords = {
    'meeting': ['meeting', 'agenda', 'attendees', 'discussion', 'action items'],
    'project': ['project', 'timeline', 'milestone', 'deliverable', 'roadmap'],
    'idea': ['idea', 'brainstorm', 'concept', 'innovation', 'creative'],
    'todo': ['todo', 'task', 'checklist', 'action', 'complete'],
    'research': ['research', 'analysis', 'study', 'findings', 'data'],
    'personal': ['personal', 'diary', 'journal', 'thoughts', 'reflection'],
    'work': ['work', 'business', 'professional', 'office', 'client'],
    'urgent': ['urgent', 'asap', 'priority', 'important', 'critical'],
    'finance': ['budget', 'cost', 'expense', 'revenue', 'financial'],
    'tech': ['code', 'development', 'programming', 'technical', 'software']
  }

  // Force re-render when notes change
  useEffect(() => {
    setLastUpdate(Date.now())
    console.log('📝 Notes updated, forcing re-render:', notes.length, 'notes')
  }, [notes])

  // Clear operation feedback after delay
  useEffect(() => {
    if (operationFeedback) {
      const timer = setTimeout(() => {
        setOperationFeedback(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [operationFeedback])

  // Focus title input when editing starts
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  // Focus tag input when showing
  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }, [showTagInput])

  // Memoized filtered notes for performance
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesFilter = selectedFilter === 'all' || 
                           (selectedFilter === 'starred' && note.is_starred) ||
                           (selectedFilter === 'shared' && note.is_shared) ||
                           (selectedFilter === 'folder' && note.folder_id === selectedFilter)

      return matchesSearch && matchesFilter
    }).sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'wordCount':
          return (b.metadata?.word_count || 0) - (a.metadata?.word_count || 0)
        default: // modified
          return new Date(b.updated_at) - new Date(a.updated_at)
      }
    })
  }, [notes, searchQuery, selectedFilter, sortBy, lastUpdate])

  // Memoized notes by folder for performance and accuracy
  const notesByFolder = useMemo(() => {
    const grouped = filteredNotes.reduce((acc, note) => {
      const folderId = note.folder_id || 'all'
      if (!acc[folderId]) acc[folderId] = []
      acc[folderId].push(note)
      return acc
    }, {})
    
    console.log('📁 Notes grouped by folder:', Object.keys(grouped).map(folderId => 
      `${folderId}: ${grouped[folderId].length} notes`
    ).join(', '))
    
    return grouped
  }, [filteredNotes, lastUpdate])

  // Auto-generate tags based on content
  const generateAutoTags = useCallback((content, title) => {
    const text = `${title} ${content}`.toLowerCase()
    const suggestedTags = []

    Object.entries(autoTagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        suggestedTags.push(tag)
      }
    })

    return suggestedTags.slice(0, 3)
  }, [autoTagKeywords])

  // Enhanced drag start handler
  const handleDragStart = useCallback((e, note) => {
    console.log('🎯 Drag started for note:', note.title)
    
    setDraggedNote(note)
    setIsDragging(true)
    setDragOperation({
      type: 'move',
      noteId: note.id,
      fromFolder: note.folder_id || 'all',
      startTime: Date.now()
    })
    
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', note.id)
    
    // Enhanced visual feedback
    e.target.style.opacity = '0.7'
    e.target.style.transform = 'scale(0.98) rotate(2deg)'
    e.target.style.transition = 'all 0.2s ease'
    e.target.style.zIndex = '1000'
    
    // Create custom drag image
    const dragImage = e.target.cloneNode(true)
    dragImage.style.transform = 'rotate(3deg) scale(0.9)'
    dragImage.style.opacity = '0.9'
    dragImage.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => document.body.removeChild(dragImage), 0)
  }, [])

  // Enhanced drag end handler
  const handleDragEnd = useCallback((e) => {
    console.log('🏁 Drag ended')
    
    // Reset visual feedback
    e.target.style.opacity = '1'
    e.target.style.transform = 'scale(1) rotate(0deg)'
    e.target.style.transition = 'all 0.3s ease'
    e.target.style.zIndex = 'auto'
    
    // Clear drag state with delay to allow drop to complete
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
    }
    
    dragTimeoutRef.current = setTimeout(() => {
      setDraggedNote(null)
      setDragOverFolder(null)
      setIsDragging(false)
      setDragOperation(null)
    }, 100)
  }, [])

  // Enhanced drag over handler
  const handleDragOver = useCallback((e, folderId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedNote && draggedNote.folder_id !== folderId) {
      setDragOverFolder(folderId)
    }
  }, [draggedNote])

  // Enhanced drag leave handler
  const handleDragLeave = useCallback((e) => {
    // Only clear if we're actually leaving the folder area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverFolder(null)
    }
  }, [])

  // Enhanced drop handler with comprehensive error handling
  const handleDrop = useCallback(async (e, folderId) => {
    e.preventDefault()
    
    console.log('📥 Drop event triggered for folder:', folderId)
    
    if (!draggedNote) {
      console.warn('⚠️ No dragged note found')
      return
    }
    
    if (draggedNote.folder_id === folderId) {
      console.log('ℹ️ Note already in target folder')
      setOperationFeedback({
        type: 'info',
        message: `Note is already in ${getFolderName(folderId)}`
      })
      return
    }
    
    try {
      console.log(`🔄 Moving note "${draggedNote.title}" from "${draggedNote.folder_id || 'all'}" to "${folderId}"`)
      
      // Show loading state
      setDragOverFolder(null)
      setOperationFeedback({
        type: 'loading',
        message: 'Moving note...'
      })
      
      const updates = {
        folder_id: folderId === 'all' ? null : folderId,
        updated_at: new Date().toISOString()
      }
      
      // Call the update function
      await onNoteUpdate(draggedNote.id, updates)
      
      // Force immediate re-render
      setLastUpdate(Date.now())
      
      // Success feedback
      setOperationFeedback({
        type: 'success',
        message: `Note moved to ${getFolderName(folderId)}`,
        icon: <CheckCircle className="h-4 w-4" />
      })
      
      console.log(`✅ Note successfully moved to folder "${folderId}"`)
      
    } catch (error) {
      console.error('❌ Failed to move note:', error)
      
      // Error feedback
      setOperationFeedback({
        type: 'error',
        message: 'Failed to move note',
        icon: <AlertCircle className="h-4 w-4" />
      })
    } finally {
      // Cleanup drag state
      setDraggedNote(null)
      setDragOverFolder(null)
      setIsDragging(false)
      setDragOperation(null)
    }
  }, [draggedNote, onNoteUpdate])

  // Handle title edit start
  const handleTitleEditStart = useCallback((note) => {
    setEditingTitle(note.id)
    setEditingTitleValue(note.title)
  }, [])

  // Handle title edit save
  const handleTitleEditSave = useCallback((note) => {
    if (editingTitleValue.trim() && editingTitleValue !== note.title) {
      const updates = {
        title: editingTitleValue.trim(),
        updated_at: new Date().toISOString()
      }
      
      // Auto-generate tags if enabled
      if (autoTagging) {
        const autoTags = generateAutoTags(note.content, editingTitleValue)
        const existingTags = note.tags || []
        const newTags = [...new Set([...existingTags, ...autoTags])].slice(0, 5)
        updates.tags = newTags
      }
      
      onNoteUpdate(note.id, updates)
    }
    
    setEditingTitle(null)
    setEditingTitleValue('')
  }, [editingTitleValue, autoTagging, generateAutoTags, onNoteUpdate])

  // Handle title edit cancel
  const handleTitleEditCancel = useCallback(() => {
    setEditingTitle(null)
    setEditingTitleValue('')
  }, [])

  // Handle tag add
  const handleTagAdd = useCallback((note) => {
    if (newTag.trim() && (!note.tags || note.tags.length < 5)) {
      const existingTags = note.tags || []
      const tagToAdd = newTag.trim().toLowerCase()
      
      if (!existingTags.includes(tagToAdd)) {
        const updates = {
          tags: [...existingTags, tagToAdd].slice(0, 5),
          updated_at: new Date().toISOString()
        }
        
        onNoteUpdate(note.id, updates)
      }
    }
    
    setNewTag('')
    setShowTagInput(null)
  }, [newTag, onNoteUpdate])

  // Handle tag remove
  const handleTagRemove = useCallback((note, tagToRemove) => {
    const updatedTags = (note.tags || []).filter(tag => tag !== tagToRemove)
    const updates = {
      tags: updatedTags,
      updated_at: new Date().toISOString()
    }
    
    onNoteUpdate(note.id, updates)
  }, [onNoteUpdate])

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }, [expandedFolders])

  // Format date
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }, [])

  // Get folder name
  const getFolderName = useCallback((folderId) => {
    if (folderId === 'all') return 'All Notes'
    const folder = folders.find(f => f.id === folderId)
    return folder ? folder.name : 'Unknown Folder'
  }, [folders])

  // Get folder color
  const getFolderColor = useCallback((folderId) => {
    if (folderId === 'all') return 'blue'
    const folder = folders.find(f => f.id === folderId)
    return folder ? folder.color : 'gray'
  }, [folders])

  return (
    <div className={`notes-manager sidebar-responsive flex flex-col h-full bg-black/20 backdrop-blur-xl border-r border-white/10 ${className}`}>
      {/* Operation Feedback */}
      {operationFeedback && (
        <div className={`absolute top-4 right-4 z-50 p-3 rounded-lg backdrop-blur-xl border transition-all duration-300 ${
          operationFeedback.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-300' :
          operationFeedback.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-300' :
          operationFeedback.type === 'loading' ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' :
          'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
        }`}>
          <div className="flex items-center gap-2">
            {operationFeedback.icon}
            <span className="text-sm font-medium">{operationFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Notes</h2>
          <Button
            onClick={onNoteCreate}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Note
          </Button>
        </div>

        {/* Search */}
        <div className="search-container relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input pl-10 bg-black/30 border-white/20 text-white placeholder-gray-400 text-responsive"
          />
        </div>

        {/* Filters */}
        <div className="filter-buttons flex gap-2 mb-4 gap-responsive">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'starred' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedFilter('starred')}
            className={selectedFilter === 'starred' ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}
          >
            <Star className="h-3 w-3 mr-1" />
            Starred
          </Button>
          <Button
            variant={selectedFilter === 'shared' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedFilter('shared')}
            className={selectedFilter === 'shared' ? 'bg-green-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}
          >
            <Share2 className="h-3 w-3 mr-1" />
            Shared
          </Button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/30 border border-white/20 rounded px-2 py-1 text-sm text-white"
          >
            <option value="modified">Last Modified</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
            <option value="wordCount">Word Count</option>
          </select>
        </div>
      </div>

      {/* Folders and Notes */}
      <ScrollArea className="flex-1 notes-list-scroll">
        <div className="p-4 space-y-2">
          {/* Folders */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Folders</h3>
            
            {/* All Notes Folder */}
            <div
              className={`folder-item p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                dragOverFolder === 'all' 
                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-500 shadow-lg transform scale-105' 
                  : 'hover:bg-white/5 hover:scale-102'
              } ${isDragging ? 'ring-2 ring-blue-500/20' : ''}`}
              onClick={() => toggleFolder('all')}
              onDragOver={(e) => handleDragOver(e, 'all')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'all')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {expandedFolders.has('all') ? (
                    <FolderOpen className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Folder className="h-4 w-4 text-blue-400" />
                  )}
                  <span className="text-sm text-white font-medium">All Notes</span>
                  {dragOverFolder === 'all' && (
                    <ArrowRight className="h-4 w-4 text-blue-400 animate-pulse" />
                  )}
                </div>
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {notesByFolder['all']?.length || 0}
                </Badge>
              </div>
            </div>

            {/* Other Folders */}
            {folders.map(folder => (
              <div
                key={folder.id}
                className={`folder-item p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  dragOverFolder === folder.id 
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-500 shadow-lg transform scale-105' 
                    : 'hover:bg-white/5 hover:scale-102'
                } ${isDragging ? 'ring-2 ring-purple-500/20' : ''}`}
                onClick={() => toggleFolder(folder.id)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {expandedFolders.has(folder.id) ? (
                      <FolderOpen className={`h-4 w-4 text-${getFolderColor(folder.id)}-400`} />
                    ) : (
                      <Folder className={`h-4 w-4 text-${getFolderColor(folder.id)}-400`} />
                    )}
                    <span className="text-sm text-white font-medium">{folder.name}</span>
                    {dragOverFolder === folder.id && (
                      <ArrowRight className={`h-4 w-4 text-${getFolderColor(folder.id)}-400 animate-pulse`} />
                    )}
                  </div>
                  <Badge variant="secondary" className={`text-xs bg-${getFolderColor(folder.id)}-500/20 text-${getFolderColor(folder.id)}-300 border border-${getFolderColor(folder.id)}-500/30`}>
                    {notesByFolder[folder.id]?.length || 0}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {Object.entries(notesByFolder).map(([folderId, folderNotes]) => (
            expandedFolders.has(folderId) && (
              <div key={folderId} className="space-y-2">
                {folderNotes.map(note => (
                  <div
                    key={note.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, note)}
                    onDragEnd={handleDragEnd}
                    className={`note-card p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      currentNote?.id === note.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50'
                        : 'bg-black/30 border-white/10 hover:bg-white/5 hover:border-white/20'
                    } ${draggedNote?.id === note.id ? 'opacity-70 scale-98 rotate-2' : ''}`}
                    onClick={() => onNoteSelect(note)}
                  >
                    {/* Note Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        {editingTitle === note.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={titleInputRef}
                              value={editingTitleValue}
                              onChange={(e) => setEditingTitleValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleTitleEditSave(note)
                                if (e.key === 'Escape') handleTitleEditCancel()
                              }}
                              className="text-sm bg-black/50 border-white/30 text-white"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTitleEditSave(note)
                              }}
                              className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTitleEditCancel()
                              }}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <h3 className="font-medium text-white text-sm truncate">{note.title}</h3>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTitleEditStart(note)
                              }}
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {note.is_starred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                        {note.is_shared && <Share2 className="h-3 w-3 text-green-400" />}
                        {note.ai_generated && <Sparkles className="h-3 w-3 text-purple-400" />}
                      </div>
                    </div>

                    {/* Enhanced Note Preview */}
                    {(() => {
                      const smartPreview = getSmartPreview(note);
                      return (
                        <div className="mb-2">
                          {smartPreview.subtitle && (
                            <p className="text-xs text-purple-300 font-medium mb-1">
                              {smartPreview.emoji} {smartPreview.subtitle}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {smartPreview.preview}
                          </p>
                        </div>
                      );
                    })()}

                    {/* Tags Section */}
                    <div className="mb-2">
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.tags.map(tag => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSearchQuery(`#${tag}`)
                              }}
                            >
                              <Hash className="h-2 w-2 mr-1" />
                              {tag}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTagRemove(note, tag)
                                }}
                                className="h-3 w-3 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Add Tag Button */}
                      {(!note.tags || note.tags.length < 5) && (
                        <div className="flex items-center gap-2">
                          {showTagInput === note.id ? (
                            <div className="flex items-center gap-1 flex-1">
                              <Input
                                ref={tagInputRef}
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleTagAdd(note)
                                  if (e.key === 'Escape') setShowTagInput(null)
                                }}
                                placeholder="Add tag..."
                                className="text-xs bg-black/50 border-white/30 text-white h-6"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTagAdd(note)
                                }}
                                className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowTagInput(null)
                                  setNewTag('')
                                }}
                                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowTagInput(note.id)
                              }}
                              className="h-6 text-xs text-gray-400 hover:text-white px-2"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              Add tag
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Note Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(note.updated_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.metadata?.word_count && (
                          <span>{note.metadata.word_count} words</span>
                        )}
                        <span>{formatDate(note.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ))}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No notes found</p>
              <p className="text-xs text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/10 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>{filteredNotes.length} of {notes.length} notes</span>
          <div className="flex items-center gap-4">
            <span>{notes.reduce((acc, note) => acc + (note.metadata?.word_count || 0), 0)} total words</span>
            <span>{notes.reduce((acc, note) => acc + (note.metadata?.character_count || 0), 0)} characters</span>
          </div>
        </div>
        {isDragging && (
          <div className="mt-2 text-center">
            <span className="text-blue-400 animate-pulse">Drop note into a folder to move it</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesManager

