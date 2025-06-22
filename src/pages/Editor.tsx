import React, { useState, useEffect } from 'react';
import { Book, Settings, Plus, Search, Heart, Save, Zap, Bot, Crown, Sparkles, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNotes } from '../contexts/NotesContext';
import { NoteCategory } from '../types/note';
import RichTextEditor from '../components/Editor/RichTextEditor';
import CollapsibleAssistant from '../components/Editor/CollapsibleAssistant';
import FocusMode from '../components/Editor/FocusMode';
import Layout from '../components/Layout/Layout';

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
  const [isFocusMode, setIsFocusMode] = useState(false);

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
        color: currentNote?.color || '#64748b', // Keep existing color or use default
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
    <Layout>
      <div className="space-y-6 h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/50">
        {/* Premium Header with Sidebar Trigger */}
        <div className="flex justify-between items-start glass p-6 rounded-2xl shadow-large">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 dark:from-blue-400 dark:to-purple-400">
                {currentNote ? 'Edit Note' : 'Create New Note'}
                <Crown className="w-8 h-8 text-yellow-500" />
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-1 dark:text-slate-300">
                {currentNote ? 'Edit with world-class AI writing assistance' : 'Create with the most advanced AI writing tools available'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 backdrop-blur-md">
                  ⚡ AI-Powered
                </Badge>
                <Badge variant="outline" className="border-0 bg-yellow-100/20 backdrop-blur-sm text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300">
                  🏆 Better than Notion AI
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFocusMode(true)}
              className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
            >
              <Focus className="w-4 h-4 mr-2" />
              Focus Mode
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all backdrop-blur-sm border-0`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>

        {/* Premium Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Main Editor Column */}
          <div className="lg:col-span-3">
            <Card className="flex-1 h-full glass shadow-large">
              <CardContent className="p-8 h-full">
                <div className="space-y-6 h-full flex flex-col">
                  {/* Enhanced Title and Meta */}
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter your brilliant title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-bold border-0 bg-white/10 backdrop-blur-sm rounded-2xl focus:bg-white/20 focus:ring-2 focus:ring-blue-200 shadow-soft dark:bg-slate-700/20 dark:focus:bg-slate-600/30 dark:text-slate-200 dark:placeholder-slate-400"
                    />
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-48 rounded-2xl bg-white/10 backdrop-blur-sm border-0 shadow-soft dark:bg-slate-700/20 dark:text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-0 dark:text-slate-200">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="dark:text-slate-200 dark:focus:bg-slate-700/50">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Enhanced Tags */}
                  <div className="flex gap-2 flex-wrap items-center">
                    {tags.map((tag) => (
                      <Badge 
                        key={tag}
                        className="bg-white/20 backdrop-blur-sm text-blue-700 border-0 rounded-full px-4 py-2 cursor-pointer hover:bg-white/30 transition-all hover:scale-105 dark:bg-blue-900/30 dark:text-blue-300"
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
                        className="w-36 h-8 text-sm border-0 bg-white/10 backdrop-blur-sm rounded-full focus:bg-white/20 dark:bg-slate-500/20 dark:focus:bg-slate-400/30 dark:text-slate-200 dark:placeholder-slate-400"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-full h-8 w-8 p-0 hover:bg-white/20 backdrop-blur-sm border-0 dark:hover:bg-slate-700/30"
                        onClick={addTag}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Premium Rich Text Editor */}
                  <div className="flex-1">
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
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
              onSuggestionApply={handleSuggestionApply}
            />
          </div>
        </div>
      </div>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={isFocusMode}
        onClose={() => setIsFocusMode(false)}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </Layout>
  );
};

export default Editor;
