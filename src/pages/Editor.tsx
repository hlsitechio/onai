import React, { useState, useEffect } from 'react';
import { Book, Settings, Plus, Search, Heart, Save, Zap, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNotes } from '../contexts/NotesContext';
import { NoteCategory } from '../types/note';
import RichTextEditor from '../components/Editor/RichTextEditor';
import WritingSuggestions from '../components/Editor/WritingSuggestions';

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
    <div className="space-y-6 h-[calc(100vh-120px)]">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {currentNote ? 'Edit Note' : 'Create New Note'}
            <Bot className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-gray-600">
            {currentNote ? 'Edit with AI-powered writing assistance' : 'Create with intelligent writing tools and AI copilot'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={isFavorite ? 'text-red-500' : 'text-gray-400'}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Editor Column */}
        <div className="lg:col-span-3">
          <Card className="flex-1 h-full">
            <CardContent className="p-8 h-full">
              <div className="space-y-6 h-full flex flex-col">
                {/* Title and Meta */}
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-semibold border-none bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
                  />
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48 rounded-xl bg-gray-50 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap items-center">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary" 
                      className="rounded-full px-3 py-1 cursor-pointer hover:bg-red-100"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="w-32 h-6 text-sm border-none bg-gray-50 rounded-full"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-full h-6 w-6 p-0"
                      onClick={addTag}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Rich Text Content */}
                <div className="flex-1">
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing with AI assistance... Press Ctrl+/ for AI help"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with AI Features */}
        <div className="lg:col-span-1 space-y-4">
          {/* Writing Suggestions */}
          <WritingSuggestions
            content={content}
            onSuggestionApply={handleSuggestionApply}
          />

          {/* AI Quick Actions */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-800">AI Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  Generate Ideas
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Research Topic
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Tone Adjustment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Writing Stats */}
          {content.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Writing Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span className="font-medium">{content.split(' ').filter(w => w.length > 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span className="font-medium">{content.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading time:</span>
                    <span className="font-medium">~{Math.ceil(content.split(' ').length / 200)} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
