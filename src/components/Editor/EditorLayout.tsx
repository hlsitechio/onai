
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import CollapsibleAssistant from './CollapsibleAssistant';
import EditorMetadata from './EditorMetadata';
import { NoteCategory } from '../../types/note';

interface EditorLayoutProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  categories: NoteCategory[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSuggestionApply: (original: string, suggestion: string) => void;
  collapseAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  expandAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  title,
  content,
  category,
  tags,
  newTag,
  categories,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onSuggestionApply,
  collapseAssistantRef,
  expandAssistantRef,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`grid gap-6 h-full transition-all duration-300 ${
      isSidebarCollapsed 
        ? 'grid-cols-1 lg:grid-cols-[1fr_4rem]' 
        : 'grid-cols-1 lg:grid-cols-4'
    }`}>
      {/* Main Editor Column */}
      <div className={isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'}>
        <Card className="flex-1 h-full glass shadow-large">
          <CardContent className="p-8 h-full">
            <div className="space-y-6 h-full flex flex-col">
              <EditorMetadata
                title={title}
                category={category}
                tags={tags}
                newTag={newTag}
                categories={categories}
                onTitleChange={onTitleChange}
                onCategoryChange={onCategoryChange}
                onNewTagChange={onNewTagChange}
                onAddTag={onAddTag}
                onRemoveTag={onRemoveTag}
              />

              {/* Rich Text Editor */}
              <div className="flex-1">
                <RichTextEditor
                  value={content}
                  onChange={onContentChange}
                  placeholder="Start writing your masterpiece... The world's most advanced AI is here to help you craft something extraordinary."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collapsible AI Sidebar */}
      <div className="lg:col-span-1">
        <CollapsibleAssistant
          content={content}
          onSuggestionApply={onSuggestionApply}
          onCollapseChange={setIsSidebarCollapsed}
          collapseRef={collapseAssistantRef}
          expandRef={expandAssistantRef}
        />
      </div>
    </div>
  );
};

export default EditorLayout;
