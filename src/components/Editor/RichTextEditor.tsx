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
    Editor: Editor & {
      [key: string]: unknown;
    };
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
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: CustomElement['type']) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'numbered-list' || format === 'bulleted-list';

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && ['numbered-list', 'bulleted-list'].includes(n.type),
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
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote {...attributes} className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc list-inside">
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-2xl font-bold mb-2">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-xl font-semibold mb-2">
          {children}
        </h2>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal list-inside">
          {children}
        </ol>
      );
    case 'code-block':
      return (
        <pre {...attributes} className="bg-gray-100 p-3 rounded font-mono text-sm">
          <code>{children}</code>
        </pre>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
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
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-1 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${isMarkActive(editor, 'bold') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isMarkActive(editor, 'italic') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isMarkActive(editor, 'underline') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isMarkActive(editor, 'code') ? 'bg-gray-200' : ''}`}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, 'code');
          }}
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${isBlockActive(editor, 'heading-one') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isBlockActive(editor, 'heading-two') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isBlockActive(editor, 'block-quote') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isBlockActive(editor, 'numbered-list') ? 'bg-gray-200' : ''}`}
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
          className={`p-2 ${isBlockActive(editor, 'bulleted-list') ? 'bg-gray-200' : ''}`}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, 'bulleted-list');
          }}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            className="min-h-96 focus:outline-none"
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
