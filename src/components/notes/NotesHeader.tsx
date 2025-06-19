
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search, Keyboard, SortAsc, Filter, MoreVertical, Download, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface NotesHeaderProps {
  onCreateNew: () => void;
  isSearching: boolean;
  onSearchToggle: () => void;
  onShowShortcuts: () => void;
  onSortNotes?: () => void;
  onFilterNotes?: () => void;
  onExportNotes?: () => void;
  onImportNotes?: () => void;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({
  onCreateNew,
  isSearching,
  onSearchToggle,
  onShowShortcuts,
  onSortNotes,
  onFilterNotes,
  onExportNotes,
  onImportNotes
}) => {
  return (
    <div className="space-y-3">
      {/* Main header */}
      <div className="flex items-center justify-between animate-slideDown" style={{animationDelay: '0.1s'}}>
        <h3 className="text-sm sm:text-base font-semibold text-white flex items-center">
          <img 
            src="/lovable-uploads/fccad14b-dab2-4cbe-82d9-fe30b6f82787.png" 
            alt="ONAI Logo" 
            className="h-4 w-4 mr-2 object-contain"
          />
          My Notes
        </h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCreateNew}
            className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all group"
            title="Create new note"
          >
            <Plus className="h-4 w-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSearchToggle}
            className={`h-7 w-7 rounded-full transition-all group ${isSearching ? 'bg-noteflow-500/20 text-noteflow-400' : 'hover:bg-noteflow-500/20 hover:text-noteflow-400'}`}
            title="Search notes"
          >
            <Search className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all group"
                title="More options"
              >
                <MoreVertical className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent 
                align="end" 
                side="bottom"
                className="w-48 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl z-[9999]"
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
              >
                <DropdownMenuItem onClick={onSortNotes} className="text-white hover:bg-noteflow-500/20 focus:bg-noteflow-500/20">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFilterNotes} className="text-white hover:bg-noteflow-500/20 focus:bg-noteflow-500/20">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={onExportNotes} className="text-white hover:bg-noteflow-500/20 focus:bg-noteflow-500/20">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onImportNotes} className="text-white hover:bg-noteflow-500/20 focus:bg-noteflow-500/20">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={onShowShortcuts} className="text-white hover:bg-noteflow-500/20 focus:bg-noteflow-500/20">
                  <Keyboard className="h-4 w-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary controls */}
      <div className="flex items-center justify-between text-xs text-slate-400 animate-slideDown" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSortNotes}
            className="h-6 px-2 text-xs hover:bg-white/10 hover:text-white"
            title="Sort by date"
          >
            <SortAsc className="h-3 w-3 mr-1" />
            Sort
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFilterNotes}
            className="h-6 px-2 text-xs hover:bg-white/10 hover:text-white"
            title="Filter notes"
          >
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
        </div>
        <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md">
          Quick Actions
        </span>
      </div>
    </div>
  );
};

export default NotesHeader;
