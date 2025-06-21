
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  title?: string;
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
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  notes,
  selectedNoteId,
  onLoadNote,
  onCreateNote,
  onDeleteNote,
  onRenameNote
}) => {
  const noteList = Object.values(notes).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="h-full bg-black/20 border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Button
          onClick={onCreateNote}
          className="w-full bg-noteflow-500 hover:bg-noteflow-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {noteList.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Create your first note to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {noteList.map((note) => (
              <div
                key={note.id}
                className={`group p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-noteflow-500/20 border border-noteflow-500/30'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => onLoadNote(note.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {note.title || 'Untitled'}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                    {note.content && (
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                        {note.content.replace(/<[^>]*>/g, '').substring(0, 60)}...
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSidebar;
