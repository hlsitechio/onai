
import { useNotes } from '../../contexts/NotesContext';

interface EditorHandlersProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  currentNote: any;
  setTags: (tags: string[]) => void;
  setNewTag: (tag: string) => void;
  setContent: (content: string) => void;
  setIsSaving: (saving: boolean) => void;
  setIsHeaderHidden: (hidden: boolean) => void;
  setIsAssistantCollapsed: (collapsed: boolean) => void;
  isHeaderHidden: boolean;
}

export const useEditorHandlers = ({
  title,
  content,
  category,
  tags,
  newTag,
  isFavorite,
  currentNote,
  setTags,
  setNewTag,
  setContent,
  setIsSaving,
  setIsHeaderHidden,
  setIsAssistantCollapsed,
  isHeaderHidden,
}: EditorHandlersProps) => {
  const { createNote, updateNote } = useNotes();

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
      // When showing header, expand AI assistant
      setIsAssistantCollapsed(false);
    } else {
      // When hiding header, collapse AI assistant
      setIsAssistantCollapsed(true);
    }
  };

  return {
    handleSave,
    addTag,
    removeTag,
    handleSuggestionApply,
    handleCollapseAllBars,
  };
};
