
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  List, 
  ListOrdered, 
  CheckSquare, 
  ChevronDown,
  Circle,
  Square,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListButtonProps {
  editor: Editor;
  className?: string;
}

const ListButton: React.FC<ListButtonProps> = ({ editor, className }) => {
  if (!editor) return null;

  const listOptions = [
    {
      name: 'Bullet List',
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      command: () => editor.chain().focus().toggleBulletList().run(),
      canExecute: () => editor.can().toggleBulletList(),
      description: 'Simple bullet points'
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      canExecute: () => editor.can().toggleOrderedList(),
      description: 'Numbered list items'
    },
    {
      name: 'Task List',
      icon: CheckSquare,
      isActive: () => editor.isActive('taskList'),
      command: () => {
        try {
          editor.chain().focus().toggleTaskList().run();
        } catch {
          // Fallback: insert checkboxes manually
          document.execCommand('insertHTML', false, '<input type="checkbox"> ');
        }
      },
      canExecute: () => {
        try {
          return editor.can().toggleTaskList();
        } catch {
          return true;
        }
      },
      description: 'Interactive checkboxes'
    },
    {
      name: 'Circle List',
      icon: Circle,
      isActive: () => false,
      command: () => {
        // Custom circle list implementation
        document.execCommand('insertHTML', false, '<ul style="list-style-type: circle;"><li></li></ul>');
      },
      canExecute: () => true,
      description: 'Hollow circle bullets'
    },
    {
      name: 'Square List',
      icon: Square,
      isActive: () => false,
      command: () => {
        // Custom square list implementation
        document.execCommand('insertHTML', false, '<ul style="list-style-type: square;"><li></li></ul>');
      },
      canExecute: () => true,
      description: 'Square bullets'
    },
    {
      name: 'Dash List',
      icon: Minus,
      isActive: () => false,
      command: () => {
        // Custom dash list implementation
        document.execCommand('insertHTML', false, '<ul style="list-style-type: none;"><li style="position: relative; padding-left: 20px;"><!-- dash --><span style="position: absolute; left: 0;">—</span></li></ul>');
      },
      canExecute: () => true,
      description: 'Dash-style bullets'
    }
  ];

  const activeList = listOptions.find(option => option.isActive());
  const ActiveIcon = activeList?.icon || List;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 hover:bg-white/10 transition-colors",
            activeList 
              ? "bg-white/20 text-white" 
              : "text-gray-300 hover:text-white",
            className
          )}
          title="Insert List"
        >
          <ActiveIcon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-[#27202C] border-white/10 text-white z-50"
      >
        {listOptions.map((option, index) => {
          const Icon = option.icon;
          const isActive = option.isActive();
          const canExecute = option.canExecute();
          
          return (
            <React.Fragment key={option.name}>
              <DropdownMenuItem
                onClick={option.command}
                disabled={!canExecute}
                className={cn(
                  "flex flex-col items-start gap-1 px-3 py-3 cursor-pointer",
                  "hover:bg-white/10 focus:bg-white/10",
                  isActive && "bg-white/20 text-white",
                  !canExecute && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{option.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-xs text-gray-400 ml-6">{option.description}</span>
              </DropdownMenuItem>
              {index === 2 && <DropdownMenuSeparator className="bg-white/10" />}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListButton;
