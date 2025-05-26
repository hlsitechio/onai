
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onOpenChange
}) => {
  const shortcuts: KeyboardShortcut[] = [
    // File Operations
    { keys: ['Ctrl', 'S'], description: 'Save current note', category: 'File Operations' },
    { keys: ['Ctrl', 'N'], description: 'Create new note', category: 'File Operations' },
    { keys: ['Ctrl', 'O'], description: 'Open notes sidebar', category: 'File Operations' },
    
    // Text Formatting
    { keys: ['Ctrl', 'B'], description: 'Bold text', category: 'Text Formatting' },
    { keys: ['Ctrl', 'I'], description: 'Italic text', category: 'Text Formatting' },
    { keys: ['Ctrl', 'U'], description: 'Underline text', category: 'Text Formatting' },
    { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'Text Formatting' },
    { keys: ['Ctrl', 'Y'], description: 'Redo', category: 'Text Formatting' },
    
    // Navigation
    { keys: ['Ctrl', 'F'], description: 'Find in note', category: 'Navigation' },
    { keys: ['Ctrl', 'H'], description: 'Find and replace', category: 'Navigation' },
    { keys: ['Escape'], description: 'Exit focus mode', category: 'Navigation' },
    
    // Notes Management
    { keys: ['Ctrl', 'D'], description: 'Duplicate note', category: 'Notes Management' },
    { keys: ['Ctrl', 'Shift', 'S'], description: 'Share note', category: 'Notes Management' },
    { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', category: 'Notes Management' }
  ];

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const renderKeyBadge = (key: string, index: number) => (
    <Badge 
      key={`${key}-${index}`}
      variant="outline" 
      className="px-2 py-1 text-xs font-mono bg-slate-100 text-slate-700 border-slate-300"
    >
      {key}
    </Badge>
  );

  const renderShortcut = (shortcut: KeyboardShortcut, index: number) => (
    <div key={`shortcut-${index}`} className="flex justify-between items-center py-2">
      <span className="text-sm text-slate-700">{shortcut.description}</span>
      <div className="flex gap-1">
        {shortcut.keys.map((key, keyIndex) => (
          <React.Fragment key={`fragment-${index}-${keyIndex}`}>
            {renderKeyBadge(key, keyIndex)}
            {keyIndex < shortcut.keys.length - 1 && (
              <span className="text-slate-400 mx-1">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to work more efficiently with your notes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts], categoryIndex) => (
            <div key={`category-${categoryIndex}`}>
              <h3 className="font-semibold text-lg mb-3 text-slate-800">{category}</h3>
              <div className="space-y-1">
                {categoryShortcuts.map((shortcut, shortcutIndex) => 
                  renderShortcut(shortcut, shortcutIndex)
                )}
              </div>
              {categoryIndex < Object.entries(groupedShortcuts).length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
