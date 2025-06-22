import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Code, List, ListOrdered, Quote, Heading1, Heading2 } from 'lucide-react';

// Define custom types for Slate
type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote' | 'numbered-list' | 'bulleted-list' | 'list-item' | 'code-block';
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
    Text: CustomText;
  }
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Helper functions for formatting
const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: CustomElement['type']) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as CustomElement).type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: CustomElement['type']) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'numbered-list' || format === 'bulleted-list';

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && ['numbered-list', 'bulleted-list'].includes((n as CustomElement).type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Render functions
const Element = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as CustomElement;
  
  switch (customElement.type) {
    case 'block-quote':
      return (
        <blockquote {...attributes} className="border-l-4 border-primary/40 pl-6 py-2 italic text-muted-foreground bg-muted/20 rounded-r-lg my-4">
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc list-inside space-y-1 my-4 pl-4">
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-3xl font-bold mb-4 text-foreground leading-tight">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-2xl font-semibold mb-3 text-foreground leading-tight">
          {children}
        </h2>
      );
    case 'list-item':
      return <li {...attributes} className="py-1">{children}</li>;
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal list-inside space-y-1 my-4 pl-4">
          {children}
        </ol>
      );
    case 'code-block':
      return (
        <pre {...attributes} className="bg-muted/50 border border-border p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto">
          <code className="text-foreground">{children}</code>
        </pre>
      );
    default:
      return <p {...attributes} className="mb-4 leading-relaxed text-foreground">{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText;
  
  if (customLeaf.bold) {
    children = <strong className="font-semibold">{children}</strong>;
  }

  if (customLeaf.code) {
    children = (
      <code className="bg-muted px-2 py-1 rounded-md text-sm font-mono border border-border">
        {children}
      </code>
    );
  }

  if (customLeaf.italic) {
    children = <em className="italic">{children}</em>;
  }

  if (customLeaf.underline) {
    children = <u className="underline decoration-2 underline-offset-2">{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = "Start writing..." }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Parse the value from string to Slate value
  const initialValue: Descendant[] = useMemo(() => {
    if (!value) {
      return [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    
    try {
      // If it's already JSON, parse it
      if (value.startsWith('[') || value.startsWith('{')) {
        return JSON.parse(value);
      }
      // Otherwise, treat as plain text
      return [{ type: 'paragraph', children: [{ text: value }] }];
    } catch {
      // Fallback to plain text
      return [{ type: 'paragraph', children: [{ text: value }] }];
    }
  }, [value]);

  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setSlateValue(newValue);
    // Convert Slate value to string for storage
    onChange(JSON.stringify(newValue));
  }, [onChange]);

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <div className="border border-border rounded-xl shadow-soft overflow-hidden bg-card">
      {/* Enhanced Toolbar */}
      <div className="editor-toolbar">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isMarkActive(editor, 'bold') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, 'bold');
            }}
          >
            <Bold className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isMarkActive(editor, 'italic') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, 'italic');
            }}
          >
            <Italic className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isMarkActive(editor, 'underline') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, 'underline');
            }}
          >
            <Underline className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isMarkActive(editor, 'code') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, 'code');
            }}
          >
            <Code className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isBlockActive(editor, 'heading-one') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'heading-one');
            }}
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isBlockActive(editor, 'heading-two') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'heading-two');
            }}
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isBlockActive(editor, 'block-quote') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'block-quote');
            }}
          >
            <Quote className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isBlockActive(editor, 'numbered-list') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'numbered-list');
            }}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`editor-button ${isBlockActive(editor, 'bulleted-list') ? 'active' : ''}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'bulleted-list');
            }}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Editor Content */}
      <div className="editor-content">
        <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            className="focus:outline-none prose prose-sm max-w-none"
            spellCheck
            onKeyDown={(event) => {
              if (!event.ctrlKey) return;

              switch (event.key) {
                case 'b': {
                  event.preventDefault();
                  toggleMark(editor, 'bold');
                  break;
                }
                case 'i': {
                  event.preventDefault();
                  toggleMark(editor, 'italic');
                  break;
                }
                case 'u': {
                  event.preventDefault();
                  toggleMark(editor, 'underline');
                  break;
                }
                case '`': {
                  event.preventDefault();
                  toggleMark(editor, 'code');
                  break;
                }
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
};

export default RichTextEditor;
