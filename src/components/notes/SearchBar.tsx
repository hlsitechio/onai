
import React from 'react';
import { Search } from "lucide-react";

interface SearchBarProps {
  isSearching: boolean;
  searchQuery: string;
  onSearchToggle: () => void;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isSearching,
  searchQuery,
  onSearchToggle,
  onSearchChange
}) => {
  return (
    <div className={`animate-slideDown overflow-hidden transition-all duration-300 ${isSearching ? 'max-h-12' : 'max-h-0'}`} style={{animationDelay: '0.2s'}}>
      <div className="relative mb-2">
        <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-8 sm:h-9 bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-noteflow-400/50 focus:border-noteflow-400/50"
        />
      </div>
    </div>
  );
};

export default SearchBar;
