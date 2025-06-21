
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  List, 
  ListOrdered, 
  CheckSquare, 
  ChevronDown 
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
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      canExecute: () => editor.can().toggleOrderedList(),
    },
    {
      name: 'Task List',
      icon: CheckSquare,
      isActive: () => editor.isActive('taskList'),
      command: () => editor.chain().focus().toggleTaskList().run(),
      canExecute: () => editor.can().toggleTaskList(),
    },
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
        className="w-48 bg-[#27202C] border-white/10 text-white z-50"
      >
        {listOptions.map((option) => {
          const Icon = option.icon;
          const isActive = option.isActive();
          const canExecute = option.canExecute();
          
          return (
            <DropdownMenuItem
              key={option.name}
              onClick={option.command}
              disabled={!canExecute}
              className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer",
                "hover:bg-white/10 focus:bg-white/10",
                isActive && "bg-white/20 text-white",
                !canExecute && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListButton;
