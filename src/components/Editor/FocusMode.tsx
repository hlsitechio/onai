
import React from 'react';
import { X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const FocusMode: React.FC<FocusModeProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isSaving,
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Blurred Background Overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-xl bg-black/20 dark:bg-black/40"
        onClick={onClose}
      />
      
      {/* Focus Mode Editor */}
      <Card className="relative w-full max-w-5xl h-[90vh] glass shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/10">
          <div className="flex items-center gap-4 flex-1">
            <Maximize2 className="w-6 h-6 text-primary" />
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter your title..."
              className="text-2xl font-bold bg-transparent border-none outline-none flex-1 text-foreground placeholder-muted-foreground"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onSave}
              disabled={!title.trim() || isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <CardContent className="p-0 h-[calc(90vh-120px)]">
          <div className="h-full p-6">
            <RichTextEditor
              value={content}
              onChange={onContentChange}
              placeholder="Focus on your writing... Let your thoughts flow without any distractions."
            />
          </div>
        </CardContent>

        {/* Footer with shortcuts */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex gap-4">
            <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to exit focus mode</span>
            <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd> to save</span>
          </div>
          <div className="text-xs opacity-60">
            Focus Mode - Distraction Free Writing
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FocusMode;
