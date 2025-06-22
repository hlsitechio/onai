
import React, { useState, useEffect } from 'react';
import { Book, Settings, Plus, Search, Heart, Save, Zap, Bot, Crown, Sparkles } from 'lucide-react';
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
    <div className="space-y-6 h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/50">
      {/* Premium Header */}
      <div className="flex justify-between items-start bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-200/50 shadow-large dark:bg-slate-800/80 dark:border-slate-600/50">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 dark:from-blue-400 dark:to-purple-400">
            {currentNote ? 'Edit Note' : 'Create New Note'}
            <Crown className="w-8 h-8 text-yellow-500" />
          </h1>
          <p className="text-gray-600 text-lg font-medium mt-1 dark:text-slate-300">
            {currentNote ? 'Edit with world-class AI writing assistance' : 'Create with the most advanced AI writing tools available'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              ⚡ AI-Powered
            </Badge>
            <Badge variant="outline" className="border-yellow-300 text-yellow-700 dark:border-yellow-400/50 dark:text-yellow-300">
              🏆 Better than Notion AI
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>

      {/* Premium Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Main Editor Column */}
        <div className="lg:col-span-3">
          <Card className="flex-1 h-full bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 shadow-large dark:bg-slate-800/60 dark:border-slate-600/50">
            <CardContent className="p-8 h-full">
              <div className="space-y-6 h-full flex flex-col">
                {/* Enhanced Title and Meta */}
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter your brilliant title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-none bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300 shadow-soft dark:from-slate-700 dark:to-slate-600 dark:focus:bg-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
                  />
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48 rounded-2xl bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-purple-200/50 shadow-soft dark:from-slate-700 dark:to-slate-600 dark:border-slate-500/50 dark:text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="dark:text-slate-200 dark:focus:bg-slate-700">
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
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 rounded-full px-4 py-2 cursor-pointer hover:from-blue-200 hover:to-purple-200 transition-all hover:scale-105 dark:from-blue-900/50 dark:to-purple-900/50 dark:text-blue-300 dark:border-blue-700/50"
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
                      className="w-36 h-8 text-sm border-2 border-dashed border-gray-300 rounded-full focus:border-blue-300 dark:border-slate-500 dark:focus:border-blue-400 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-full h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700 dark:hover:to-slate-600"
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

        {/* Premium AI Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Enhanced Writing Suggestions */}
          <WritingSuggestions
            content={content}
            onSuggestionApply={handleSuggestionApply}
          />

          {/* Premium AI Features */}
          <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200/50 shadow-large dark:from-purple-900/20 dark:via-slate-800/80 dark:to-pink-900/20 dark:border-purple-700/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-purple-800 dark:text-purple-300">AI Power Tools</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Next-generation features</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 dark:border-slate-600 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 dark:hover:border-purple-500/50 dark:text-slate-200">
                  <Bot className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Generate Ideas
                  <Badge className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">NEW</Badge>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 dark:border-slate-600 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 dark:hover:border-blue-500/50 dark:text-slate-200">
                  <Search className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Research Topic
                  <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">PRO</Badge>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-2 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 dark:border-slate-600 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 dark:hover:border-pink-500/50 dark:text-slate-200">
                  <Settings className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                  Tone Adjustment
                  <Badge className="ml-auto bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">AI</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Writing Stats */}
          {content.length > 0 && (
            <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200/50 shadow-medium dark:from-slate-800/50 dark:to-slate-700/50 dark:border-slate-600/50">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2 dark:text-slate-200">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Writing Analytics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg dark:bg-slate-700/50">
                    <span className="font-medium dark:text-slate-300">Words:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {content.split(' ').filter(w => w.length > 0).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg dark:bg-slate-700/50">
                    <span className="font-medium dark:text-slate-300">Characters:</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                      {content.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg dark:bg-slate-700/50">
                    <span className="font-medium dark:text-slate-300">Reading time:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      ~{Math.ceil(content.split(' ').length / 200)} min
                    </Badge>
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
