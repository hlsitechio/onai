
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Menu, 
  Plus, 
  Search, 
  X,
  FileText,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onLoadNote: (content: string) => void;
  onSave: () => void;
  onDeleteNote: (id: string) => void;
  allNotes: Record<string, string>;
  onCreateNew: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  currentContent,
  onLoadNote,
  onSave,
  onDeleteNote,
  allNotes,
  onCreateNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Convert Record<string, string> to array for filtering
  const notesArray = Object.entries(allNotes).map(([id, content]) => ({
    id,
    content,
    title: content.split('\n')[0].substring(0, 50).trim() || 'Untitled Note',
    created_at: id, // Using ID as timestamp for now
    updated_at: id,
  }));

  const filteredNotes = notesArray.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const timestamp = Number(dateString);
      if (isNaN(timestamp)) return 'Unknown';
      
      const date = new Date(timestamp);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[90vw] max-w-[400px] p-0 bg-black/95 backdrop-blur-xl border-r border-white/10"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Notes</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10 p-2"
              >
                <X className="h-5 w-5" />
              </Button>
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
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="w-full bg-noteflow-500 hover:bg-noteflow-600 text-white py-3 h-auto"
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
                    onClick={() => {
                      onLoadNote(note.content);
                      onClose();
                    }}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-left transition-all duration-200 touch-manipulation"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate text-base">
                          {note.title}
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
