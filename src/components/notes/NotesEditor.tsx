
import React, { useEffect, useState } from 'react';
import { useNotesManager } from '@/hooks/useNotesManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FileText, Edit3, Bold, Italic, Code, ListOrdered, ListCheck, Quote, Heading, Image, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { Separator } from '@/components/ui/separator';
import { marked } from 'marked';

interface NotesEditorProps {
  className?: string;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ className }) => {
  const {
    currentNote,
    saving,
    saveNote,
    autoSave,
  } = useNotesManager();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  // Debounce content for auto-save
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  // Update local state when current note changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setHasUnsavedChanges(false);
    } else {
      setTitle('');
      setContent('');
      setHasUnsavedChanges(false);
    }
  }, [currentNote]);

  // Auto-save when content changes
  useEffect(() => {
    if (currentNote && (debouncedContent !== currentNote.content || debouncedTitle !== currentNote.title)) {
      autoSave(currentNote.id, debouncedContent, debouncedTitle);
      setHasUnsavedChanges(false);
    }
  }, [currentNote, debouncedContent, debouncedTitle, autoSave]);

  // Track unsaved changes
  useEffect(() => {
    if (currentNote) {
      setHasUnsavedChanges(
        content !== currentNote.content || title !== currentNote.title
      );
    }
  }, [currentNote, content, title]);

  const handleSave = async () => {
    if (!currentNote) return;

    const success = await saveNote(currentNote.id, { title, content });
    if (success) {
      setHasUnsavedChanges(false);
      toast({
        title: 'Note saved',
        description: 'Your note has been saved successfully.',
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const insertMarkdown = (markdownSyntax: string, selectionOffset = 0) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = 
      content.substring(0, start) + 
      markdownSyntax.replace('$selection', selectedText) + 
      content.substring(end);
    
    setContent(newText);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText ? 
        start + markdownSyntax.indexOf('$selection') + selectedText.length + selectionOffset :
        start + markdownSyntax.indexOf('$selection') + selectionOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatCommands = {
    bold: () => insertMarkdown('**$selection**', 0),
    italic: () => insertMarkdown('*$selection*', 0),
    heading: () => insertMarkdown('### $selection', 0),
    code: () => insertMarkdown('`$selection`', 0),
    codeBlock: () => insertMarkdown('```\n$selection\n```', 0),
    blockquote: () => insertMarkdown('> $selection', 0),
    orderedList: () => insertMarkdown('1. $selection', 0),
    unorderedList: () => insertMarkdown('- $selection', 0),
    taskList: () => insertMarkdown('- [ ] $selection', 0),
    link: () => insertMarkdown('[$selection](url)', 0),
    image: () => insertMarkdown('![$selection](image-url)', 0),
  };

  if (!currentNote) {
    return (
      <div className={cn("flex-1 flex items-center justify-center bg-black/10", className)}>
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No note selected</h3>
          <p className="text-gray-400">Select a note from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 flex flex-col bg-black/10", className)}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-noteflow-400" />
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="Note title..."
              className="bg-transparent border-none text-xl font-semibold text-white placeholder:text-gray-400 p-0 h-auto focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-gray-400">Unsaved changes</span>
          )}
          {saving && (
            <span className="text-xs text-noteflow-400">Saving...</span>
          )}
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            size="sm"
            variant="outline"
            className="border-white/10"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            size="sm"
            className="bg-noteflow-500 hover:bg-noteflow-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Markdown Toolbar - only show in edit mode */}
      {!previewMode && (
        <div className="flex items-center gap-1 p-2 border-b border-white/10 overflow-x-auto bg-black/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.bold}
            title="Bold"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.italic}
            title="Italic"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.heading}
            title="Heading"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Heading className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.code}
            title="Inline Code"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.codeBlock}
            title="Code Block"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Code className="h-4 w-4 mr-1" />
            <span className="text-xs">Block</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.blockquote}
            title="Blockquote"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.orderedList}
            title="Ordered List"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.unorderedList}
            title="Unordered List"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.taskList}
            title="Task List"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ListCheck className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.link}
            title="Link"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCommands.image}
            title="Image"
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-auto">
        {previewMode ? (
          <div 
            className="prose prose-invert max-w-none h-full overflow-auto"
            dangerouslySetInnerHTML={{ __html: marked(content || '') }}
          />
        ) : (
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your note using Markdown..."
            className="w-full h-full bg-transparent text-white placeholder:text-gray-400 border-none outline-none resize-none text-lg leading-relaxed"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        )}
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between p-4 border-t border-white/10 text-xs text-gray-400">
        <div>
          Last updated: {new Date(currentNote.updated_at).toLocaleString()}
        </div>
        <div>
          {content.length} characters
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;
