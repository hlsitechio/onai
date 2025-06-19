
import React from 'react';
import { Image, Link, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            editor.chain().focus().setImage({ src: url }).run();
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
        editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const handleTableInsert = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  const insertButtons = [
    {
      icon: Image,
      onClick: handleImageUpload,
      title: 'Insert Image',
      isActive: () => false
    },
    {
      icon: Link,
      onClick: handleLinkInsert,
      title: 'Insert Link',
      isActive: () => editor?.isActive('link') || false
    },
    {
      icon: Table,
      onClick: handleTableInsert,
      title: 'Insert Table',
      isActive: () => editor?.isActive('table') || false
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {insertButtons.map((button, index) => {
        const Icon = button.icon;
        const isActive = button.isActive();
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
              isActive 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:text-white"
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

export default InsertControls;
