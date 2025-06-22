import React, { useState } from 'react';
import { Search, Book, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const notes = [
    {
      id: '1',
      title: 'Meeting Notes - Q1 Planning',
      content: 'Discussed quarterly goals and team objectives...',
      category: 'meeting',
      tags: ['planning', 'team', 'goals'],
      updatedAt: '2 hours ago',
      wordCount: 450,
    },
    {
      id: '2',
      title: 'React Best Practices',
      content: 'Key principles for writing maintainable React code...',
      category: 'learning',
      tags: ['react', 'development', 'best-practices'],
      updatedAt: '5 hours ago',
      wordCount: 820,
    },
    {
      id: '3',
      title: 'AI Assistant Ideas',
      content: 'Brainstorming features for the AI note assistant...',
      category: 'brainstorm',
      tags: ['ai', 'features', 'innovation'],
      updatedAt: '1 day ago',
      wordCount: 320,
    },
    {
      id: '4',
      title: 'Project Roadmap',
      content: 'Timeline and milestones for the upcoming project...',
      category: 'project',
      tags: ['roadmap', 'timeline', 'milestones'],
      updatedAt: '2 days ago',
      wordCount: 650,
    },
    {
      id: '5',
      title: 'Learning Journal',
      content: 'Daily reflections on new concepts and skills...',
      category: 'learning',
      tags: ['journal', 'reflection', 'growth'],
      updatedAt: '3 days ago',
      wordCount: 280,
    },
    {
      id: '6',
      title: 'Client Feedback',
      content: 'Summary of client meeting and feedback points...',
      category: 'meeting',
      tags: ['client', 'feedback', 'improvement'],
      updatedAt: '4 days ago',
      wordCount: 520,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'meeting', label: 'Meeting', color: 'blue' },
    { value: 'learning', label: 'Learning', color: 'green' },
    { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
    { value: 'project', label: 'Project', color: 'orange' },
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Notes
          </h1>
          <p className="text-gray-600">
            {filteredNotes.length} notes found
          </p>
        </div>
        <Button onClick={() => navigate('/editor')}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search notes, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl bg-white border-gray-200"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48 rounded-xl bg-white border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            className="cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/editor')}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="rounded-full text-xs">
                        {note.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {note.wordCount} words
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="p-1">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {note.content}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{note.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-4 h-4 bg-blue-500">
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">
                      Updated {note.updatedAt}
                    </span>
                  </div>
                  <Book className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mb-4 mx-auto" />
          <h3 className="text-lg text-gray-500 mb-2">
            No notes found
          </h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search terms or create a new note
          </p>
          <Button onClick={() => navigate('/editor')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Note
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notes;
