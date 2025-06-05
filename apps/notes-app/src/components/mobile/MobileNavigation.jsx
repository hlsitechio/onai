import React from 'react';
import { 
  Menu, 
  FileText, 
  Settings, 
  Brain, 
  Plus, 
  Search 
} from 'lucide-react';

/**
 * Mobile Navigation Component
 * 
 * Provides a mobile-friendly bottom navigation bar with quick access
 * to key app functions. Only visible on mobile devices.
 */
const MobileNavigation = ({ 
  onToggleSidebar, 
  onToggleAI, 
  onNewNote, 
  onOpenSettings,
  onSearch
}) => {
  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="mobile-header hidden">
        <button 
          className="mobile-menu-button" 
          onClick={onToggleSidebar}
          aria-label="Toggle Notes Sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold">ONAI Notes</h1>
        <button 
          className="mobile-menu-button" 
          onClick={onSearch}
          aria-label="Search Notes"
        >
          <Search size={24} />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav hidden">
        <button 
          className="mobile-nav-button" 
          onClick={onToggleSidebar}
          aria-label="Notes"
        >
          <FileText size={20} />
          <span>Notes</span>
        </button>
        
        <button 
          className="mobile-nav-button" 
          onClick={onNewNote}
          aria-label="New Note"
        >
          <Plus size={20} />
          <span>New</span>
        </button>
        
        <button 
          className="mobile-nav-button" 
          onClick={onToggleAI}
          aria-label="AI Assistant"
        >
          <Brain size={20} />
          <span>AI</span>
        </button>
        
        <button 
          className="mobile-nav-button" 
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </>
  );
};

export default MobileNavigation;

