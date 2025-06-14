
import React from 'react';
import NotesHeader from './NotesHeader';
import SearchBar from './SearchBar';

interface SidebarHeaderProps {
  onCreateNew: () => void;
  isSearching: boolean;
  onSearchToggle: () => void;
  onShowShortcuts: () => void;
  onSortNotes: () => void;
  onFilterNotes: () => void;
  onExportNotes: () => void;
  onImportNotes: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onCreateNew,
  isSearching,
  onSearchToggle,
  onShowShortcuts,
  onSortNotes,
  onFilterNotes,
  onExportNotes,
  onImportNotes,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="p-3 sm:p-4 border-b border-white/10 bg-black/20">
      <NotesHeader 
        onCreateNew={onCreateNew} 
        isSearching={isSearching} 
        onSearchToggle={onSearchToggle} 
        onShowShortcuts={onShowShortcuts} 
        onSortNotes={onSortNotes} 
        onFilterNotes={onFilterNotes} 
        onExportNotes={onExportNotes} 
        onImportNotes={onImportNotes} 
      />
      
      <SearchBar 
        isSearching={isSearching} 
        searchQuery={searchQuery} 
        onSearchToggle={onSearchToggle} 
        onSearchChange={onSearchChange} 
      />
    </div>
  );
};

export default SidebarHeader;
