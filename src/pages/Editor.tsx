
import React, { useState, useEffect } from 'react';
import { Book, Settings, Plus, Search, Heart, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNotes } from '../contexts/NotesContext';
import { NoteCategory } from '../types/note';
import RichTextEditor from '../components/Editor/RichTextEditor';

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

  return (
    <div className="space-y-6 h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentNote ? 'Edit Note' : 'Create New Note'}
          </h1>
          <p className="text-gray-600">
            {currentNote ? 'Edit your existing note with rich text formatting' : 'Create and organize your thoughts with rich text'}
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

      {/* Editor */}
      <Card className="flex-1">
        <CardContent className="p-8">
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
                placeholder="Start writing your note with rich text formatting..."
              />
            </div>

            {/* AI Suggestions */}
            {content.length > 50 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Search className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-700">
                        AI Suggestion
                      </p>
                      <p className="text-sm text-blue-600">
                        Try using headings and bullet points to organize your rich text content better.
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-100">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editor;
