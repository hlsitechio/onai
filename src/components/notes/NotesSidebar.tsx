
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileText, Trash2, Edit3 } from 'lucide-react';
import CreateMenuDropdown from '../editor/bubble-menu/CreateMenuDropdown';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesSidebarProps {
  notes: Record<string, Note>;
  selectedNoteId: string | null;
  onLoadNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onRenameNote: (noteId: string, newTitle: string) => void;
  onSaveNote?: () => void;
  saving?: boolean;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  notes,
  selectedNoteId,
  onLoadNote,
  onCreateNote,
  onDeleteNote,
  onRenameNote,
  onSaveNote,
  saving = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const notesArray = Object.values(notes);
  const filteredNotes = notesArray.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRename = (noteId: string, currentTitle: string) => {
    setEditingNoteId(noteId);
    setEditingTitle(currentTitle);
  };

  const handleRenameSubmit = () => {
    if (editingNoteId && editingTitle.trim()) {
      onRenameNote(editingNoteId, editingTitle.trim());
    }
    setEditingNoteId(null);
    setEditingTitle('');
  };

  const handleRenameCancel = () => {
    setEditingNoteId(null);
    setEditingTitle('');
  };

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <CreateMenuDropdown 
            onSaveNote={onSaveNote}
            onCreateNote={onCreateNote}
            saving={saving}
          />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Create your first note to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`group p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedNoteId === note.id
                      ? 'bg-purple-500/20 border-purple-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => onLoadNote(note.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingNoteId === note.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameSubmit();
                              if (e.key === 'Escape') handleRenameCancel();
                            }}
                            onBlur={handleRenameSubmit}
                            className="h-6 text-sm bg-transparent border-white/20 focus:border-purple-500/50"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <h3 className="font-medium text-sm truncate mb-1 group-hover:text-white">
                          {note.title}
                        </h3>
                      )}
                      <p className="text-xs text-white/50 truncate">
                        {note.content.replace(/<[^>]*>/g, '').slice(0, 60)}...
                      </p>
                      <p className="text-xs text-white/30 mt-1">
                        {note.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Note Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(note.id, note.title);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
