
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutCategory {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onOpenChange }) => {
  const shortcutCategories: ShortcutCategory[] = [
    {
      title: 'Text Formatting',
      shortcuts: [
        { keys: ['Ctrl', 'B'], description: 'Bold text' },
        { keys: ['Ctrl', 'I'], description: 'Italic text' },
        { keys: ['Ctrl', 'U'], description: 'Underline text' },
        { keys: ['Ctrl', 'Shift', 'X'], description: 'Strikethrough' },
      ]
    },
    {
      title: 'Document Actions',
      shortcuts: [
        { keys: ['Ctrl', 'S'], description: 'Save note' },
        { keys: ['Ctrl', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Y'], description: 'Redo' },
        { keys: ['Ctrl', 'A'], description: 'Select all' },
      ]
    },
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['Ctrl', 'N'], description: 'New note' },
        { keys: ['Ctrl', 'F'], description: 'Find in notes' },
        { keys: ['Esc'], description: 'Exit focus mode' },
      ]
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-white">Keyboard Shortcuts</SheetTitle>
          <SheetDescription className="text-gray-400">
            Speed up your workflow with these shortcuts
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {shortcutCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h4 className="text-sm font-semibold text-white/80 border-b border-white/10 pb-2">
                {category.title}
              </h4>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, shortcutIndex) => (
                  <div key={shortcutIndex} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && (
                            <span className="text-gray-500 text-xs">+</span>
                          )}
                          <Kbd className="text-xs py-0 px-2">
                            {key}
                          </Kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default KeyboardShortcuts;
