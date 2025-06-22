
import React, { useState } from 'react';
import { Book, Settings, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');

  const categories = [
    { value: 'general', label: 'General', color: 'gray' },
    { value: 'meeting', label: 'Meeting', color: 'blue' },
    { value: 'learning', label: 'Learning', color: 'green' },
    { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
    { value: 'project', label: 'Project', color: 'orange' },
  ];

  const handleSave = () => {
    console.log('Saving note:', { title, content, category });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Note Editor
          </h1>
          <p className="text-gray-600">
            Create and edit your notes with AI assistance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4 mr-2" />
            AI Assist
          </Button>
          <Button onClick={handleSave}>
            <Book className="w-4 h-4 mr-2" />
            Save Note
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
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                #productivity
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1 bg-green-100 text-green-700">
                #ideas
              </Badge>
              <Button size="sm" variant="ghost" className="rounded-full h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Content */}
            <Textarea
              placeholder="Start writing your note... Use '@ai' to get AI assistance"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-96 resize-none border-none bg-white text-base leading-relaxed focus:ring-0 focus:border-none"
            />

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
                        Consider adding more details about the implementation steps.
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
