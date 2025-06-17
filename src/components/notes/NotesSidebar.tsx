
import React from 'react';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, FileText, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const NotesSidebar: React.FC = () => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    createNote,
    deleteNote,
  } = useNotesManager();

  const { toast } = useToast();

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
    }
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const success = await deleteNote(noteId);
    if (success && currentNote?.id === noteId) {
      // If we deleted the current note, select the first available note
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setCurrentNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
  };

  const formatNoteTitle = (note: any) => {
    if (note.title && note.title.trim()) {
      return note.title.length > 30 ? `${note.title.substring(0, 30)}...` : note.title;
    }
    
    // Fallback to first line of content
    const firstLine = note.content.split('\n')[0].trim();
    if (firstLine) {
      return firstLine.length > 30 ? `${firstLine.substring(0, 30)}...` : firstLine;
    }
    
    return 'Untitled Note';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-noteflow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <Button
            onClick={handleCreateNote}
            size="sm"
            className="bg-noteflow-500 hover:bg-noteflow-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <div className="text-sm text-gray-400">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No notes yet</p>
              <Button
                onClick={handleCreateNote}
                variant="outline"
                className="border-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first note
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setCurrentNote(note)}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer transition-colors border",
                    currentNote?.id === note.id
                      ? "bg-noteflow-500/20 border-noteflow-500/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {formatNoteTitle(note)}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(note.updated_at)}
                      </div>
                      {note.content && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                          {note.content.substring(0, 60)}...
                        </p>
                      )}
                    </div>
                    
                    <Button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotesSidebar;
