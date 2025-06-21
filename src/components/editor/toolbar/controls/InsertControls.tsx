import React from 'react';
import { Plus, Calendar, Clock, User, Hash, Star } from 'lucide-react';
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
  const insertDate = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    try {
      if (editor?.chain) {
        editor.chain().focus().insertContent(dateString).run();
      } else {
        document.execCommand('insertText', false, dateString);
      }
    } catch {
      document.execCommand('insertText', false, dateString);
    }
  };

  const insertTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    try {
      if (editor?.chain) {
        editor.chain().focus().insertContent(timeString).run();
      } else {
        document.execCommand('insertText', false, timeString);
      }
    } catch {
      document.execCommand('insertText', false, timeString);
    }
  };

  const insertDateTime = () => {
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    try {
      if (editor?.chain) {
        editor.chain().focus().insertContent(dateTimeString).run();
      } else {
        document.execCommand('insertText', false, dateTimeString);
      }
    } catch {
      document.execCommand('insertText', false, dateTimeString);
    }
  };

  const insertSignature = () => {
    const signature = `
<div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #374151;">
  <p style="margin: 0; color: #6b7280;">Best regards,</p>
  <p style="margin: 0.5rem 0 0 0; font-weight: 600;">Your Name</p>
</div>`;
    
    try {
      if (editor?.chain) {
        editor.chain().focus().insertContent(signature).run();
      } else {
        document.execCommand('insertHTML', false, signature);
      }
    } catch {
      document.execCommand('insertHTML', false, signature);
    }
  };

  const insertSymbol = (symbol: string) => {
    try {
      if (editor?.chain) {
        editor.chain().focus().insertContent(symbol).run();
      } else {
        document.execCommand('insertText', false, symbol);
      }
    } catch {
      document.execCommand('insertText', false, symbol);
    }
  };

  const insertOptions = [
    {
      icon: Calendar,
      label: 'Current Date',
      onClick: insertDate,
      description: 'Insert today\'s date'
    },
    {
      icon: Clock,
      label: 'Current Time',
      onClick: insertTime,
      description: 'Insert current time'
    },
    {
      icon: Calendar,
      label: 'Date & Time',
      onClick: insertDateTime,
      description: 'Insert current date and time'
    },
    {
      icon: User,
      label: 'Signature',
      onClick: insertSignature,
      description: 'Insert signature template'
    }
  ];

  const commonSymbols = [
    { symbol: '©', name: 'Copyright' },
    { symbol: '®', name: 'Registered' },
    { symbol: '™', name: 'Trademark' },
    { symbol: '§', name: 'Section' },
    { symbol: '¶', name: 'Paragraph' },
    { symbol: '†', name: 'Dagger' },
    { symbol: '‡', name: 'Double Dagger' },
    { symbol: '•', name: 'Bullet' },
    { symbol: '→', name: 'Right Arrow' },
    { symbol: '←', name: 'Left Arrow' },
    { symbol: '↑', name: 'Up Arrow' },
    { symbol: '↓', name: 'Down Arrow' },
    { symbol: '★', name: 'Star' },
    { symbol: '♦', name: 'Diamond' },
    { symbol: '♠', name: 'Spade' },
    { symbol: '♥', name: 'Heart' },
    { symbol: '♣', name: 'Club' },
    { symbol: '°', name: 'Degree' },
    { symbol: '±', name: 'Plus-Minus' },
    { symbol: '∞', name: 'Infinity' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          title="Insert Special Content"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-[#27202C] border-white/10 text-white z-50 max-h-96 overflow-y-auto"
      >
        {insertOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.label}
              onClick={option.onClick}
              className="flex items-start gap-2 px-3 py-3 cursor-pointer hover:bg-white/10 focus:bg-white/10"
            >
              <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-400">{option.description}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator className="bg-white/10" />
        
        <div className="px-3 py-2">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Common Symbols
          </div>
          <div className="grid grid-cols-4 gap-1">
            {commonSymbols.map((item) => (
              <button
                key={item.symbol}
                onClick={() => insertSymbol(item.symbol)}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors text-sm font-mono"
                title={item.name}
              >
                {item.symbol}
              </button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InsertControls;
