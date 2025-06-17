
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { Plus, Search, FileText, MoreVertical, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotesSidebarProps {
  className?: string;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ className }) => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    createNote,
    deleteNote,
    renameNote,
  } = useNotesManager();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = async () => {
    await createNote();
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleNoteSelect = (note: typeof notes[0]) => {
    setCurrentNote(note);
    setEditingNoteId(null);
  };

  const handleStartRename = (note: typeof notes[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
  };

  const handleFinishRename = async (noteId: string) => {
    if (editingTitle.trim()) {
      await renameNote(noteId, editingTitle.trim());
    }
    setEditingNoteId(null);
    setEditingTitle('');
  };

  const handleCancelRename = () => {
    setEditingNoteId(null);
    setEditingTitle('');
  };

  if (loading) {
    return (
      <div className={cn("w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4", className)}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-noteflow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <Button
            size="sm"
            onClick={handleCreateNote}
            className="bg-noteflow-500 hover:bg-noteflow-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No notes found</p>
              <Button
                size="sm"
                onClick={handleCreateNote}
                className="bg-noteflow-500 hover:bg-noteflow-600"
              >
                Create your first note
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-white/5 border border-transparent",
                    currentNote?.id === note.id
                      ? "bg-noteflow-500/20 border-noteflow-400/30"
                      : "hover:border-white/10"
                  )}
                  onClick={() => handleNoteSelect(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      <FileText className={`h-3.5 w-3.5 text-noteflow-400 mt-0.5 shrink-0 ${currentNote?.id === note.id ? 'opacity-100' : 'opacity-50'}`} />
                      <div className="flex-1 min-w-0">
                        {editingNoteId === note.id ? (
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleFinishRename(note.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleFinishRename(note.id);
                              } else if (e.key === 'Escape') {
                                handleCancelRename();
                              }
                            }}
                            className="bg-white/10 border-white/20 text-white text-sm h-6 px-2"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <h3 className="font-medium text-white truncate text-sm">
                            {note.title || 'Untitled'}
                          </h3>
                        )}
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {note.content.replace(/<[^>]*>/g, '').substring(0, 100) || 'No content'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                        <DropdownMenuItem
                          onClick={(e) => handleStartRename(note, e)}
                          className="text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
