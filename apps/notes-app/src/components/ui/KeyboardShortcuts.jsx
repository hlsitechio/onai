// Keyboard Shortcuts Component
// File: src/components/ui/KeyboardShortcuts.jsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Keyboard, 
  Command, 
  Apple, 
  Monitor, 
  Zap,
  Edit,
  FileText,
  Save,
  Search,
  Plus,
  Copy,
  Scissors,
  RotateCcw,
  RotateCw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Maximize,
  Eye,
  Settings,
  HelpCircle
} from 'lucide-react';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const [currentOS, setCurrentOS] = useState('windows');

  // Detect operating system
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setCurrentOS('mac');
    } else if (userAgent.includes('linux')) {
      setCurrentOS('linux');
    } else {
      setCurrentOS('windows');
    }
  }, []);

  const shortcuts = {
    windows: {
      general: [
        { keys: ['Ctrl', 'N'], description: 'Create new note', icon: <Plus className="h-4 w-4" /> },
        { keys: ['Ctrl', 'S'], description: 'Save current note', icon: <Save className="h-4 w-4" /> },
        { keys: ['Ctrl', 'F'], description: 'Search notes', icon: <Search className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Switch editor mode', icon: <Edit className="h-4 w-4" /> },
        { keys: ['F11'], description: 'Toggle fullscreen', icon: <Maximize className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'T'], description: 'Open templates', icon: <FileText className="h-4 w-4" /> },
        { keys: ['Ctrl', ','], description: 'Open settings', icon: <Settings className="h-4 w-4" /> },
        { keys: ['Ctrl', '?'], description: 'Show keyboard shortcuts', icon: <HelpCircle className="h-4 w-4" /> }
      ],
      editing: [
        { keys: ['Ctrl', 'B'], description: 'Bold text', icon: <Bold className="h-4 w-4" /> },
        { keys: ['Ctrl', 'I'], description: 'Italic text', icon: <Italic className="h-4 w-4" /> },
        { keys: ['Ctrl', 'U'], description: 'Underline text', icon: <Underline className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'S'], description: 'Strikethrough text', icon: <Scissors className="h-4 w-4" /> },
        { keys: ['Ctrl', 'K'], description: 'Insert link', icon: <Link className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'I'], description: 'Insert image', icon: <Image className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Insert code block', icon: <Code className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'Q'], description: 'Insert quote', icon: <Quote className="h-4 w-4" /> }
      ],
      lists: [
        { keys: ['Ctrl', 'Shift', 'L'], description: 'Create bullet list', icon: <List className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'O'], description: 'Create numbered list', icon: <ListOrdered className="h-4 w-4" /> },
        { keys: ['Tab'], description: 'Indent list item', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Shift', 'Tab'], description: 'Outdent list item', icon: <Zap className="h-4 w-4" /> }
      ],
      navigation: [
        { keys: ['Ctrl', 'Z'], description: 'Undo', icon: <RotateCcw className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Y'], description: 'Redo', icon: <RotateCw className="h-4 w-4" /> },
        { keys: ['Ctrl', 'A'], description: 'Select all', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Ctrl', 'C'], description: 'Copy', icon: <Copy className="h-4 w-4" /> },
        { keys: ['Ctrl', 'V'], description: 'Paste', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Ctrl', 'X'], description: 'Cut', icon: <Scissors className="h-4 w-4" /> },
        { keys: ['Escape'], description: 'Close dialogs/modals', icon: <Zap className="h-4 w-4" /> }
      ]
    },
    mac: {
      general: [
        { keys: ['⌘', 'N'], description: 'Create new note', icon: <Plus className="h-4 w-4" /> },
        { keys: ['⌘', 'S'], description: 'Save current note', icon: <Save className="h-4 w-4" /> },
        { keys: ['⌘', 'F'], description: 'Search notes', icon: <Search className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'E'], description: 'Switch editor mode', icon: <Edit className="h-4 w-4" /> },
        { keys: ['⌘', 'Ctrl', 'F'], description: 'Toggle fullscreen', icon: <Maximize className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'T'], description: 'Open templates', icon: <FileText className="h-4 w-4" /> },
        { keys: ['⌘', ','], description: 'Open settings', icon: <Settings className="h-4 w-4" /> },
        { keys: ['⌘', '?'], description: 'Show keyboard shortcuts', icon: <HelpCircle className="h-4 w-4" /> }
      ],
      editing: [
        { keys: ['⌘', 'B'], description: 'Bold text', icon: <Bold className="h-4 w-4" /> },
        { keys: ['⌘', 'I'], description: 'Italic text', icon: <Italic className="h-4 w-4" /> },
        { keys: ['⌘', 'U'], description: 'Underline text', icon: <Underline className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'S'], description: 'Strikethrough text', icon: <Scissors className="h-4 w-4" /> },
        { keys: ['⌘', 'K'], description: 'Insert link', icon: <Link className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'I'], description: 'Insert image', icon: <Image className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'C'], description: 'Insert code block', icon: <Code className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'Q'], description: 'Insert quote', icon: <Quote className="h-4 w-4" /> }
      ],
      lists: [
        { keys: ['⌘', 'Shift', 'L'], description: 'Create bullet list', icon: <List className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'O'], description: 'Create numbered list', icon: <ListOrdered className="h-4 w-4" /> },
        { keys: ['Tab'], description: 'Indent list item', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Shift', 'Tab'], description: 'Outdent list item', icon: <Zap className="h-4 w-4" /> }
      ],
      navigation: [
        { keys: ['⌘', 'Z'], description: 'Undo', icon: <RotateCcw className="h-4 w-4" /> },
        { keys: ['⌘', 'Shift', 'Z'], description: 'Redo', icon: <RotateCw className="h-4 w-4" /> },
        { keys: ['⌘', 'A'], description: 'Select all', icon: <Zap className="h-4 w-4" /> },
        { keys: ['⌘', 'C'], description: 'Copy', icon: <Copy className="h-4 w-4" /> },
        { keys: ['⌘', 'V'], description: 'Paste', icon: <Zap className="h-4 w-4" /> },
        { keys: ['⌘', 'X'], description: 'Cut', icon: <Scissors className="h-4 w-4" /> },
        { keys: ['Escape'], description: 'Close dialogs/modals', icon: <Zap className="h-4 w-4" /> }
      ]
    },
    linux: {
      general: [
        { keys: ['Ctrl', 'N'], description: 'Create new note', icon: <Plus className="h-4 w-4" /> },
        { keys: ['Ctrl', 'S'], description: 'Save current note', icon: <Save className="h-4 w-4" /> },
        { keys: ['Ctrl', 'F'], description: 'Search notes', icon: <Search className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Switch editor mode', icon: <Edit className="h-4 w-4" /> },
        { keys: ['F11'], description: 'Toggle fullscreen', icon: <Maximize className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'T'], description: 'Open templates', icon: <FileText className="h-4 w-4" /> },
        { keys: ['Ctrl', ','], description: 'Open settings', icon: <Settings className="h-4 w-4" /> },
        { keys: ['Ctrl', '?'], description: 'Show keyboard shortcuts', icon: <HelpCircle className="h-4 w-4" /> }
      ],
      editing: [
        { keys: ['Ctrl', 'B'], description: 'Bold text', icon: <Bold className="h-4 w-4" /> },
        { keys: ['Ctrl', 'I'], description: 'Italic text', icon: <Italic className="h-4 w-4" /> },
        { keys: ['Ctrl', 'U'], description: 'Underline text', icon: <Underline className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'S'], description: 'Strikethrough text', icon: <Scissors className="h-4 w-4" /> },
        { keys: ['Ctrl', 'K'], description: 'Insert link', icon: <Link className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'I'], description: 'Insert image', icon: <Image className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Insert code block', icon: <Code className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'Q'], description: 'Insert quote', icon: <Quote className="h-4 w-4" /> }
      ],
      lists: [
        { keys: ['Ctrl', 'Shift', 'L'], description: 'Create bullet list', icon: <List className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Shift', 'O'], description: 'Create numbered list', icon: <ListOrdered className="h-4 w-4" /> },
        { keys: ['Tab'], description: 'Indent list item', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Shift', 'Tab'], description: 'Outdent list item', icon: <Zap className="h-4 w-4" /> }
      ],
      navigation: [
        { keys: ['Ctrl', 'Z'], description: 'Undo', icon: <RotateCcw className="h-4 w-4" /> },
        { keys: ['Ctrl', 'Y'], description: 'Redo', icon: <RotateCw className="h-4 w-4" /> },
        { keys: ['Ctrl', 'A'], description: 'Select all', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Ctrl', 'C'], description: 'Copy', icon: <Copy className="h-4 w-4" /> },
        { keys: ['Ctrl', 'V'], description: 'Paste', icon: <Zap className="h-4 w-4" /> },
        { keys: ['Ctrl', 'X'], description: 'Cut', icon: <Scissors className="h-4 w-4" /> },
        { keys: ['Escape'], description: 'Close dialogs/modals', icon: <Zap className="h-4 w-4" /> }
      ]
    }
  };

  const getOSIcon = (os) => {
    switch (os) {
      case 'mac': return <Apple className="h-5 w-5" />;
      case 'linux': return <Monitor className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const getOSName = (os) => {
    switch (os) {
      case 'mac': return 'macOS';
      case 'linux': return 'Linux';
      default: return 'Windows';
    }
  };

  const KeyboardShortcutItem = ({ shortcut }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
          {shortcut.icon}
        </div>
        <span className="text-gray-300 text-sm font-medium">{shortcut.description}</span>
      </div>
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, index) => (
          <React.Fragment key={index}>
            <Badge 
              variant="outline" 
              className="bg-gray-900/50 text-gray-300 border-gray-600/50 px-2 py-1 text-xs font-mono font-semibold"
            >
              {key}
            </Badge>
            {index < shortcut.keys.length - 1 && (
              <span className="text-gray-500 text-xs mx-1">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const ShortcutSection = ({ title, shortcuts, icon }) => (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <KeyboardShortcutItem key={index} shortcut={shortcut} />
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-700">
        <DialogHeader className="p-6 pb-4 border-b border-gray-700/50">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Keyboard className="h-5 w-5 text-white" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Master ONAI with these powerful keyboard shortcuts to boost your productivity
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <Tabs value={currentOS} onValueChange={setCurrentOS} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-800/50 border border-gray-700/50">
              <TabsTrigger 
                value="windows" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Monitor className="h-4 w-4" />
                Windows
              </TabsTrigger>
              <TabsTrigger 
                value="mac" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Apple className="h-4 w-4" />
                macOS
              </TabsTrigger>
              <TabsTrigger 
                value="linux" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Monitor className="h-4 w-4" />
                Linux
              </TabsTrigger>
            </TabsList>

            {Object.keys(shortcuts).map((os) => (
              <TabsContent key={os} value={os} className="mt-0">
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getOSIcon(os)}
                      <h3 className="text-lg font-semibold text-white">
                        {getOSName(os)} Shortcuts
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ShortcutSection 
                        title="General" 
                        shortcuts={shortcuts[os].general}
                        icon={<Command className="h-5 w-5 text-purple-400" />}
                      />
                      <ShortcutSection 
                        title="Text Editing" 
                        shortcuts={shortcuts[os].editing}
                        icon={<Edit className="h-5 w-5 text-blue-400" />}
                      />
                      <ShortcutSection 
                        title="Lists & Formatting" 
                        shortcuts={shortcuts[os].lists}
                        icon={<List className="h-5 w-5 text-green-400" />}
                      />
                      <ShortcutSection 
                        title="Navigation" 
                        shortcuts={shortcuts[os].navigation}
                        icon={<Zap className="h-5 w-5 text-yellow-400" />}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="p-6 pt-0 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              💡 Tip: These shortcuts work throughout the ONAI application
            </div>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;

