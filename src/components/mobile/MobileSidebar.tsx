
import React, { useState } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  X,
  FileText,
  Clock
} from "lucide-react";

interface Note {
  id: string;
  content: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

interface MobileSidebarProps {
  notes: Note[];
  currentNote: Note | null;
  onLoadNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
  onCreateNew: () => Promise<void>;
  loading: boolean;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  notes,
  currentNote,
  onLoadNote,
  onDeleteNote,
  onCreateNew,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    (note.title || note.content.split('\n')[0].substring(0, 50).trim() || 'Untitled Note').toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const getNoteTitle = (note: Note) => {
    return note.title || note.content.split('\n')[0].substring(0, 50).trim() || 'Untitled Note';
  };

  return (
    <div className="w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Notes</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-noteflow-500 text-base"
          />
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-4">
        <Button
          onClick={onCreateNew}
          className="w-full bg-noteflow-500 hover:bg-noteflow-600 text-white py-3 h-auto"
          disabled={loading}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notes found</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => onLoadNote(note)}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 touch-manipulation ${
                  currentNote?.id === note.id 
                    ? 'bg-white/20 border-white/20' 
                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate text-base">
                      {getNoteTitle(note)}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                      {note.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center mt-2 text-xs text-slate-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(note.updated_at)}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MobileSidebar;
