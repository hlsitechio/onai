
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Keyboard, Command } from "lucide-react";

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onOpenChange }) => {
  const shortcuts = [
    {
      category: "Text Formatting",
      items: [
        { key: "Ctrl + B", description: "Bold text" },
        { key: "Ctrl + I", description: "Italic text" },
        { key: "Ctrl + U", description: "Underline text" },
        { key: "Ctrl + Z", description: "Undo" },
        { key: "Ctrl + Y", description: "Redo" },
      ]
    },
    {
      category: "Note Management",
      items: [
        { key: "Ctrl + S", description: "Save current note" },
        { key: "Ctrl + N", description: "Create new note" },
        { key: "Ctrl + D", description: "Delete current note" },
      ]
    },
    {
      category: "AI Features",
      items: [
        { key: "Ctrl + Shift + A", description: "Toggle AI Agent" },
        { key: "Ctrl + G", description: "Open AI Sidebar" },
        { key: "Ctrl + Enter", description: "Process with AI" },
      ]
    },
    {
      category: "Navigation",
      items: [
        { key: "Ctrl + B", description: "Toggle Notes Sidebar" },
        { key: "F11", description: "Toggle Focus Mode" },
        { key: "Ctrl + F", description: "Search notes" },
        { key: "Esc", description: "Exit current action" },
      ]
    },
    {
      category: "Text Alignment",
      items: [
        { key: "Ctrl + L", description: "Align left" },
        { key: "Ctrl + E", description: "Align center" },
        { key: "Ctrl + R", description: "Align right" },
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl border border-white/20 text-white max-h-[85vh] overflow-y-auto fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-[9999] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-noteflow-400" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {shortcuts.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="text-sm font-medium text-noteflow-300 uppercase tracking-wider border-b border-white/10 pb-2">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-black/30 rounded-lg border border-white/5 hover:bg-black/40 transition-colors">
                    <span className="text-sm text-slate-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.key.split(' + ').map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && <span className="text-slate-500 text-xs">+</span>}
                          <kbd className="px-2 py-1 text-xs font-mono bg-black/50 border border-white/20 rounded text-noteflow-200 shadow-sm">
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-noteflow-500/10 border border-noteflow-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Command className="h-4 w-4 text-noteflow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-300">
              <p className="font-medium text-noteflow-300 mb-1">Pro Tip:</p>
              <p>Use these shortcuts to boost your productivity while writing and editing notes. Most shortcuts work across different parts of the application.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
