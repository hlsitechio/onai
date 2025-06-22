
import React from 'react';
import { AppSidebar } from '../components/Layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useEditorState } from '../components/Editor/EditorState';
import { useEditorHandlers } from '../components/Editor/EditorHandlers';
import EditorContent from '../components/Editor/EditorContent';

const Editor: React.FC = () => {
  const editorState = useEditorState();
  const editorHandlers = useEditorHandlers({
    title: editorState.title,
    content: editorState.content,
    category: editorState.category,
    tags: editorState.tags,
    newTag: editorState.newTag,
    isFavorite: editorState.isFavorite,
    currentNote: editorState.currentNote,
    setTags: editorState.setTags,
    setNewTag: editorState.setNewTag,
    setContent: editorState.setContent,
    setIsSaving: editorState.setIsSaving,
    setIsHeaderHidden: editorState.setIsHeaderHidden,
    setIsAssistantCollapsed: editorState.setIsAssistantCollapsed,
    isHeaderHidden: editorState.isHeaderHidden,
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <EditorContent
            // Form state
            title={editorState.title}
            content={editorState.content}
            category={editorState.category}
            tags={editorState.tags}
            newTag={editorState.newTag}
            isFavorite={editorState.isFavorite}
            isSaving={editorState.isSaving}
            
            // UI state
            isFocusMode={editorState.isFocusMode}
            isHeaderCollapsed={editorState.isHeaderCollapsed}
            isHeaderHidden={editorState.isHeaderHidden}
            
            // Form handlers
            onTitleChange={editorState.setTitle}
            onContentChange={editorState.setContent}
            onCategoryChange={editorState.setCategory}
            onNewTagChange={editorState.setNewTag}
            onAddTag={editorHandlers.addTag}
            onRemoveTag={editorHandlers.removeTag}
            onFavoriteToggle={() => editorState.setIsFavorite(!editorState.isFavorite)}
            onSave={editorHandlers.handleSave}
            onSuggestionApply={editorHandlers.handleSuggestionApply}
            
            // UI handlers
            onFocusModeToggle={() => editorState.setIsFocusMode(true)}
            onHeaderCollapseToggle={() => editorState.setIsHeaderCollapsed(!editorState.isHeaderCollapsed)}
            onCollapseAllBars={editorHandlers.handleCollapseAllBars}
            onFocusModeClose={() => editorState.setIsFocusMode(false)}
            
            // Refs and computed
            collapseAssistantRef={editorState.collapseAssistantRef}
            expandAssistantRef={editorState.expandAssistantRef}
            currentNote={editorState.currentNote}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
