import React from 'react';
import { Code, FileCode } from 'lucide-react';
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

interface CodeBlockControlsProps {
  editor: Editor;
}

const CodeBlockControls: React.FC<CodeBlockControlsProps> = ({ editor }) => {
  const languages = [
    { name: 'Plain Text', value: 'text' },
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'Python', value: 'python' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'JSON', value: 'json' },
    { name: 'Markdown', value: 'markdown' },
    { name: 'Bash', value: 'bash' },
    { name: 'SQL', value: 'sql' }
  ];

  const insertCodeBlock = (language: string = 'text') => {
    try {
      if (editor?.chain) {
        editor.chain().focus().toggleCodeBlock({ language }).run();
      } else {
        const codeHtml = `<pre><code class="language-${language}">// Your code here</code></pre>`;
        document.execCommand('insertHTML', false, codeHtml);
      }
    } catch {
      const codeHtml = `<pre style="background: #1a1a1a; color: #fff; padding: 1rem; border-radius: 0.5rem; font-family: 'Courier New', monospace;"><code>// Your code here</code></pre>`;
      document.execCommand('insertHTML', false, codeHtml);
    }
  };

  const insertInlineCode = () => {
    try {
      if (editor?.chain) {
        editor.chain().focus().toggleCode().run();
      } else {
        document.execCommand('insertHTML', false, '<code>code</code>');
      }
    } catch {
      document.execCommand('insertHTML', false, '<code>code</code>');
    }
  };

  const isCodeBlockActive = () => {
    return editor?.isActive('codeBlock') || false;
  };

  const isInlineCodeActive = () => {
    return editor?.isActive('code') || false;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={insertInlineCode}
        className={cn(
          "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
          isInlineCodeActive() 
            ? "bg-white/20 text-white" 
            : "text-gray-300 hover:text-white"
        )}
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
              isCodeBlockActive() 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:text-white"
            )}
            title="Code Block"
          >
            <FileCode className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-40 bg-[#27202C] border-white/10 text-white z-50 max-h-64 overflow-y-auto"
        >
          <DropdownMenuItem
            onClick={() => insertCodeBlock()}
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
          >
            <FileCode className="h-4 w-4 mr-2" />
            <span>Plain Code Block</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/10" />
          
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => insertCodeBlock(lang.value)}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
            >
              <span className="text-sm">{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CodeBlockControls;
