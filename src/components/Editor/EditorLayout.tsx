
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
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
  showCollapseAllButton?: boolean;
  onCollapseAllBars?: () => void;
  isAllBarsCollapsed?: boolean;
  isAssistantCollapsed?: boolean;
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
  showCollapseAllButton = false,
  onCollapseAllBars,
  isAllBarsCollapsed = false,
  isAssistantCollapsed = false,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Update refs to control assistant collapse state
  React.useEffect(() => {
    if (collapseAssistantRef) {
      collapseAssistantRef.current = () => setIsSidebarCollapsed(true);
    }
    if (expandAssistantRef) {
      expandAssistantRef.current = () => setIsSidebarCollapsed(false);
    }
  }, [collapseAssistantRef, expandAssistantRef]);

  return (
    <div className="relative">
      {/* Floating Show All Bars Button - moved to top-right corner */}
      {showCollapseAllButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-6 right-6 z-50"
        >
          <Button
            onClick={onCollapseAllBars}
            className="glass shadow-large bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            {isAllBarsCollapsed ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show All Bars
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-4 h-4 mr-2" />
                Collapse All
              </>
            )}
          </Button>
        </motion.div>
      )}

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
            isCollapsed={isAssistantCollapsed}
            onCollapseToggle={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
