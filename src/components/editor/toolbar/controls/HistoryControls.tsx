
import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface HistoryControlsProps {
  editor?: Editor;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({ editor }) => {
  const historyButtons = [
    {
      icon: Undo,
      onClick: () => {
        if (editor?.chain) {
          editor.chain().focus().undo().run();
        } else {
          document.execCommand('undo', false);
        }
      },
      canExecute: () => editor?.can().chain().focus().undo().run() || true,
      title: 'Undo (Ctrl+Z)'
    },
    {
      icon: Redo,
      onClick: () => {
        if (editor?.chain) {
          editor.chain().focus().redo().run();
        } else {
          document.execCommand('redo', false);
        }
      },
      canExecute: () => editor?.can().chain().focus().redo().run() || true,
      title: 'Redo (Ctrl+Y)'
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {historyButtons.map((button, index) => {
        const Icon = button.icon;
        const canExecute = button.canExecute();
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            disabled={!canExecute}
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
              canExecute
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            )}
            title={button.title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};

export default HistoryControls;
