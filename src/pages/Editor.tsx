
import React, { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { NoteCategory } from '../types/note';
import FocusMode from '../components/Editor/FocusMode';
import Layout from '../components/Layout/Layout';
import EditorHeader from '../components/Editor/EditorHeader';
import EditorLayout from '../components/Editor/EditorLayout';

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

  return (
    <Layout>
      <div className="space-y-6 h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/50">
        <EditorHeader
          isNewNote={!currentNote}
          isFavorite={isFavorite}
          isSaving={isSaving}
          canSave={title.trim().length > 0}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          onFocusModeToggle={() => setIsFocusMode(true)}
          onSave={handleSave}
        />

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
        />
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
    </Layout>
  );
};

export default Editor;
