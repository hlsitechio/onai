
import React from 'react';
import { Image, Link, Table, Code2, Quote, Minus, Calendar } from 'lucide-react';
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

interface InsertControlsProps {
  editor: Editor;
}

const InsertControls: React.FC<InsertControlsProps> = ({ editor }) => {
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (url && editor) {
            try {
              editor.chain().focus().setImage({ src: url }).run();
            } catch {
              // Fallback: insert as img tag
              document.execCommand('insertHTML', false, `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      if (editor.state.selection.empty) {
        const text = window.prompt('Enter link text:') || url;
        try {
          editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
        } catch {
          document.execCommand('insertHTML', false, `<a href="${url}">${text}</a>`);
        }
      } else {
        try {
          editor.chain().focus().setLink({ href: url }).run();
        } catch {
          document.execCommand('createLink', false, url);
        }
      }
    }
  };

  const handleTableInsert = () => {
    if (editor) {
      try {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      } catch {
        // Fallback: insert basic HTML table
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
    }
  };

  const handleCodeBlockInsert = () => {
    try {
      editor.chain().focus().toggleCodeBlock().run();
    } catch {
      document.execCommand('formatBlock', false, 'pre');
    }
  };

  const handleBlockquoteInsert = () => {
    try {
      editor.chain().focus().toggleBlockquote().run();
    } catch {
      document.execCommand('formatBlock', false, 'blockquote');
    }
  };

  const handleHorizontalRuleInsert = () => {
    try {
      editor.chain().focus().setHorizontalRule().run();
    } catch {
      document.execCommand('insertHTML', false, '<hr>');
    }
  };

  const handleDateInsert = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    try {
      editor.chain().focus().insertContent(dateString).run();
    } catch {
      document.execCommand('insertText', false, dateString);
    }
  };

  const insertOptions = [
    {
      icon: Image,
      label: 'Image',
      onClick: handleImageUpload,
      shortcut: null
    },
    {
      icon: Link,
      label: 'Link',
      onClick: handleLinkInsert,
      shortcut: 'Ctrl+K'
    },
    {
      icon: Table,
      label: 'Table',
      onClick: handleTableInsert,
      shortcut: null
    },
    {
      icon: Code2,
      label: 'Code Block',
      onClick: handleCodeBlockInsert,
      shortcut: null
    },
    {
      icon: Quote,
      label: 'Quote',
      onClick: handleBlockquoteInsert,
      shortcut: null
    },
    {
      icon: Minus,
      label: 'Divider',
      onClick: handleHorizontalRuleInsert,
      shortcut: null
    },
    {
      icon: Calendar,
      label: 'Date',
      onClick: handleDateInsert,
      shortcut: null
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          title="Insert Elements"
        >
          <span className="text-xs mr-1">Insert</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-[#27202C] border-white/10 text-white z-50"
      >
        {insertOptions.map((option, index) => {
          const Icon = option.icon;
          
          return (
            <React.Fragment key={option.label}>
              <DropdownMenuItem
                onClick={option.onClick}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                {option.shortcut && (
                  <span className="ml-auto text-xs text-gray-400">{option.shortcut}</span>
                )}
              </DropdownMenuItem>
              {index === 2 && <DropdownMenuSeparator className="bg-white/10" />}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InsertControls;
