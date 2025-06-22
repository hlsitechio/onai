
import React from 'react';
import EditorHeader from './EditorHeader';
import EditorLayout from './EditorLayout';
import FocusMode from './FocusMode';
import { NoteCategory } from '../../types/note';

const categories: NoteCategory[] = [
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

interface EditorContentProps {
  // Form state
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  isSaving: boolean;
  
  // UI state
  isFocusMode: boolean;
  isHeaderCollapsed: boolean;
  isHeaderHidden: boolean;
  
  // Form handlers
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onFavoriteToggle: () => void;
  onSave: () => void;
  onSuggestionApply: (original: string, suggestion: string) => void;
  
  // UI handlers
  onFocusModeToggle: () => void;
  onHeaderCollapseToggle: () => void;
  onCollapseAllBars: () => void;
  onFocusModeClose: () => void;
  
  // Refs and computed
  collapseAssistantRef: React.MutableRefObject<(() => void) | undefined>;
  expandAssistantRef: React.MutableRefObject<(() => void) | undefined>;
  currentNote: any;
}

const EditorContent: React.FC<EditorContentProps> = ({
  title,
  content,
  category,
  tags,
  newTag,
  isFavorite,
  isSaving,
  isFocusMode,
  isHeaderCollapsed,
  isHeaderHidden,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onFavoriteToggle,
  onSave,
  onSuggestionApply,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onCollapseAllBars,
  onFocusModeClose,
  collapseAssistantRef,
  expandAssistantRef,
  currentNote,
}) => {
  return (
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
          onFavoriteToggle={onFavoriteToggle}
          onFocusModeToggle={onFocusModeToggle}
          onHeaderCollapseToggle={onHeaderCollapseToggle}
          onSave={onSave}
          onCollapseAllBars={onCollapseAllBars}
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
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            onCategoryChange={onCategoryChange}
            onNewTagChange={onNewTagChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSuggestionApply={onSuggestionApply}
            collapseAssistantRef={collapseAssistantRef}
            expandAssistantRef={expandAssistantRef}
            showCollapseAllButton={isHeaderHidden}
            onCollapseAllBars={onCollapseAllBars}
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
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            onCategoryChange={onCategoryChange}
            onNewTagChange={onNewTagChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSuggestionApply={onSuggestionApply}
            collapseAssistantRef={collapseAssistantRef}
            expandAssistantRef={expandAssistantRef}
            showCollapseAllButton={isHeaderHidden}
            onCollapseAllBars={onCollapseAllBars}
          />
        </div>
      )}

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={isFocusMode}
        onClose={onFocusModeClose}
        title={title}
        content={content}
        onTitleChange={onTitleChange}
        onContentChange={onContentChange}
        onSave={onSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default EditorContent;
