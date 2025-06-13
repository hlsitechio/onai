
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';

interface ShortcutCategory {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const KeyboardShortcuts: React.FC = () => {
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
    <Card className="bg-black/40 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Keyboard Shortcuts</CardTitle>
        <CardDescription className="text-gray-400">
          Speed up your workflow with these shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                        <Badge variant="outline" className="text-xs py-0 px-2 bg-gray-800 border-gray-600 text-gray-300">
                          {key}
                        </Badge>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeyboardShortcuts;
