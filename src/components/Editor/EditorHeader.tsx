
import React from 'react';
import { EditorHeaderProps } from './EditorHeaderTypes';
import EditorHeaderCollapsed from './EditorHeaderCollapsed';
import EditorHeaderExpanded from './EditorHeaderExpanded';

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  isCollapsed = false,
  isHeaderCollapsed = false,
  onFavoriteToggle,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onSave,
  onCollapseAllBars,
}) => {
  if (isCollapsed) {
    return (
      <EditorHeaderCollapsed
        isNewNote={isNewNote}
        isFavorite={isFavorite}
        isSaving={isSaving}
        canSave={canSave}
        onFavoriteToggle={onFavoriteToggle}
        onFocusModeToggle={onFocusModeToggle}
        onSave={onSave}
        onCollapseAllBars={onCollapseAllBars}
      />
    );
  }

  return (
    <EditorHeaderExpanded
      isNewNote={isNewNote}
      isFavorite={isFavorite}
      isSaving={isSaving}
      canSave={canSave}
      isHeaderCollapsed={isHeaderCollapsed}
      onFavoriteToggle={onFavoriteToggle}
      onFocusModeToggle={onFocusModeToggle}
      onHeaderCollapseToggle={onHeaderCollapseToggle}
      onSave={onSave}
      onCollapseAllBars={onCollapseAllBars}
    />
  );
};

export default EditorHeader;
