
import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { NoteCategory } from '../types/note';
import FocusMode from '../components/Editor/FocusMode';
import EditorHeader from '../components/Editor/EditorHeader';
import EditorLayout from '../components/Editor/EditorLayout';
import { AppSidebar } from '../components/Layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

const categories: NoteCategory[] = [
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

const Editor: React.FC = () => {
  const { currentNote, createNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  
  // References to trigger AI assistant collapse/expand
  const collapseAssistantRef = useRef<() => void>();
  const expandAssistantRef = useRef<() => void>();

  // Load current note when it changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setCategory(currentNote.category);
      setTags(currentNote.tags);
      setIsFavorite(currentNote.isFavorite);
    } else {
      // Clear form for new note
      setTitle('');
      setContent('');
      setCategory('general');
      setTags([]);
      setIsFavorite(false);
    }
  }, [currentNote]);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        isFavorite,
        color: currentNote?.color || '#64748b', // Keep existing color or use default
      };

      if (currentNote) {
        await updateNote(currentNote.id, noteData);
      } else {
        await createNote(noteData);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionApply = (original: string, suggestion: string) => {
    // Simple text replacement for demonstration
    const updatedContent = content.replace(original, suggestion);
    setContent(updatedContent);
  };

  const handleCollapseAllBars = () => {
    // Toggle header visibility and AI assistant collapse/expand
    setIsHeaderHidden(!isHeaderHidden);
    
    if (isHeaderHidden) {
      // Expand AI assistant when showing header
      if (expandAssistantRef.current) {
        expandAssistantRef.current();
      }
    } else {
      // Collapse AI assistant when hiding header
      if (collapseAssistantRef.current) {
        collapseAssistantRef.current();
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="p-4 space-y-4 h-screen overflow-hidden">
            {/* Conditionally render header based on isHeaderHidden */}
            {!isHeaderHidden && (
              <EditorHeader
                isNewNote={!currentNote}
                isFavorite={isFavorite}
                isSaving={isSaving}
                canSave={title.trim().length > 0}
                isCollapsed={isFocusMode}
                isHeaderCollapsed={isHeaderCollapsed}
                onFavoriteToggle={() => setIsFavorite(!isFavorite)}
                onFocusModeToggle={() => setIsFocusMode(true)}
                onHeaderCollapseToggle={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                onSave={handleSave}
                onCollapseAllBars={handleCollapseAllBars}
              />
            )}

            {!isFocusMode && !isHeaderCollapsed && (
              <div className={isHeaderHidden ? "h-[calc(100vh-32px)]" : "h-[calc(100vh-120px)]"}>
                <EditorLayout
                  title={title}
                  content={content}
                  category={category}
                  tags={tags}
                  newTag={newTag}
                  categories={categories}
                  onTitleChange={setTitle}
                  onContentChange={setContent}
                  onCategoryChange={setCategory}
                  onNewTagChange={setNewTag}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                  onSuggestionApply={handleSuggestionApply}
                  collapseAssistantRef={collapseAssistantRef}
                  expandAssistantRef={expandAssistantRef}
                  showCollapseAllButton={isHeaderHidden}
                  onCollapseAllBars={handleCollapseAllBars}
                />
              </div>
            )}

            {!isFocusMode && isHeaderCollapsed && (
              <div className={isHeaderHidden ? "h-[calc(100vh-32px)]" : "h-[calc(100vh-80px)]"}>
                <EditorLayout
                  title={title}
                  content={content}
                  category={category}
                  tags={tags}
                  newTag={newTag}
                  categories={categories}
                  onTitleChange={setTitle}
                  onContentChange={setContent}
                  onCategoryChange={setCategory}
                  onNewTagChange={setNewTag}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                  onSuggestionApply={handleSuggestionApply}
                  collapseAssistantRef={collapseAssistantRef}
                  expandAssistantRef={expandAssistantRef}
                  showCollapseAllButton={isHeaderHidden}
                  onCollapseAllBars={handleCollapseAllBars}
                />
              </div>
            )}
          </div>
        </SidebarInset>
      </div>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={isFocusMode}
        onClose={() => setIsFocusMode(false)}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </SidebarProvider>
  );
};

export default Editor;
