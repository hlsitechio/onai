
import React from 'react';
import { Plus, BookOpen, Heart, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useNotes();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate stats
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const categoryCounts = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/editor');
  };

  const handleEditNote = (note: any) => {
    setCurrentNote(note);
    navigate('/editor');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your notes today.
          </p>
        </div>
        <Button size="lg" onClick={handleCreateNote} className="rounded-xl">
          <Plus className="w-5 h-5 mr-2" />
          Create Note
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Notes</p>
                <p className="text-3xl font-bold">{totalNotes}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Favorites</p>
                <p className="text-3xl font-bold">{favoriteNotes}</p>
              </div>
              <Heart className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold">{Object.keys(categoryCounts).length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold">
                  {notes.filter(note => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(note.createdAt) > weekAgo;
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No notes yet</p>
                <Button onClick={handleCreateNote}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first note
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleEditNote(note)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800 truncate">
                          {note.title}
                        </h4>
                        {note.isFavorite && (
                          <Heart className="w-3 h-3 text-red-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {note.content || 'No content yet...'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {note.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/notes')}
                >
                  View all notes →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleCreateNote}
                className="h-20 flex-col gap-2 rounded-xl"
              >
                <Plus className="w-6 h-6" />
                New Note
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/notes')}
                className="h-20 flex-col gap-2 rounded-xl"
              >
                <BookOpen className="w-6 h-6" />
                View Notes
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/chat')}
                className="h-20 flex-col gap-2 rounded-xl"
              >
                <TrendingUp className="w-6 h-6" />
                AI Chat
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const favoriteNotes = notes.filter(note => note.isFavorite);
                  if (favoriteNotes.length > 0) {
                    setCurrentNote(favoriteNotes[0]);
                    navigate('/editor');
                  } else {
                    navigate('/notes');
                  }
                }}
                className="h-20 flex-col gap-2 rounded-xl"
              >
                <Heart className="w-6 h-6" />
                Favorites
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
