
import React from 'react';
import EditorHeader from './EditorHeader';
import EditorContentLayout from './EditorContentLayout';
import FocusMode from './FocusMode';
import { EditorFormState, EditorFormHandlers } from './EditorFormProps';
import { EditorUIState, EditorUIHandlers, EditorRefs } from './EditorUIProps';

interface EditorContentProps extends EditorFormState, EditorFormHandlers, EditorUIState, EditorUIHandlers, EditorRefs {
  currentNote: any;
}

const EditorContent: React.FC<EditorContentProps> = ({
  // Form state and handlers
  title,
  content,
  category,
  tags,
  newTag,
  isFavorite,
  isSaving,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onFavoriteToggle,
  onSave,
  onSuggestionApply,
  
  // UI state and handlers
  isFocusMode,
  isHeaderCollapsed,
  isHeaderHidden,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onCollapseAllBars,
  onFocusModeClose,
  
  // Refs and computed
  collapseAssistantRef,
  expandAssistantRef,
  currentNote,
}) => {
  const shouldShowLayout = !isFocusMode;
  const canSave = title.trim().length > 0;

  return (
    <div className="p-4 space-y-4 h-screen overflow-hidden">
      {/* Header */}
      {!isHeaderHidden && (
        <EditorHeader
          isNewNote={!currentNote}
          isFavorite={isFavorite}
          isSaving={isSaving}
          canSave={canSave}
          isCollapsed={isFocusMode}
          isHeaderCollapsed={isHeaderCollapsed}
          onFavoriteToggle={onFavoriteToggle}
          onFocusModeToggle={onFocusModeToggle}
          onHeaderCollapseToggle={onHeaderCollapseToggle}
          onSave={onSave}
          onCollapseAllBars={onCollapseAllBars}
        />
      )}

      {/* Main Editor Layout */}
      {shouldShowLayout && (
        <EditorContentLayout
          title={title}
          content={content}
          category={category}
          tags={tags}
          newTag={newTag}
          isFavorite={isFavorite}
          isSaving={isSaving}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
          onCategoryChange={onCategoryChange}
          onNewTagChange={onNewTagChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onFavoriteToggle={onFavoriteToggle}
          onSave={onSave}
          onSuggestionApply={onSuggestionApply}
          collapseAssistantRef={collapseAssistantRef}
          expandAssistantRef={expandAssistantRef}
          isHeaderHidden={isHeaderHidden}
          isHeaderCollapsed={isHeaderCollapsed}
          onCollapseAllBars={onCollapseAllBars}
        />
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
