import React from 'react';
import { Table, Plus, Minus, Columns, Rows } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface TableControlsProps {
  editor: Editor;
}

const TableControls: React.FC<TableControlsProps> = ({ editor }) => {
  const insertTable = () => {
    try {
      if (editor && editor.chain) {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      } else {
        const table = `
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
            </thead>
            <tbody>
              <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
              <tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr>
            </tbody>
          </table>
        `;
        document.execCommand('insertHTML', false, table);
      }
    } catch {
      document.execCommand('insertHTML', false, '<table><tr><td>Table</td></tr></table>');
    }
  };

  const addRowBefore = () => {
    try {
      editor?.chain().focus().addRowBefore().run();
    } catch {
      console.log('Add row before not available');
    }
  };

  const addRowAfter = () => {
    try {
      editor?.chain().focus().addRowAfter().run();
    } catch {
      console.log('Add row after not available');
    }
  };

  const addColumnBefore = () => {
    try {
      editor?.chain().focus().addColumnBefore().run();
    } catch {
      console.log('Add column before not available');
    }
  };

  const addColumnAfter = () => {
    try {
      editor?.chain().focus().addColumnAfter().run();
    } catch {
      console.log('Add column after not available');
    }
  };

  const deleteTable = () => {
    try {
      editor?.chain().focus().deleteTable().run();
    } catch {
      console.log('Delete table not available');
    }
  };

  const tableOptions = [
    {
      icon: Table,
      label: 'Insert Table',
      onClick: insertTable,
    },
    {
      icon: Plus,
      label: 'Add Row Before',
      onClick: addRowBefore,
    },
    {
      icon: Plus,
      label: 'Add Row After', 
      onClick: addRowAfter,
    },
    {
      icon: Columns,
      label: 'Add Column Before',
      onClick: addColumnBefore,
    },
    {
      icon: Columns,
      label: 'Add Column After',
      onClick: addColumnAfter,
    },
    {
      icon: Minus,
      label: 'Delete Table',
      onClick: deleteTable,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          title="Table Options"
        >
          <Table className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-[#27202C] border-white/10 text-white z-50"
      >
        {tableOptions.map((option, index) => {
          const Icon = option.icon;
          
          return (
            <React.Fragment key={option.label}>
              <DropdownMenuItem
                onClick={option.onClick}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
              </DropdownMenuItem>
              {index === 0 && <DropdownMenuSeparator className="bg-white/10" />}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableControls;
