import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range, Text } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import SmartToolbar from './SmartToolbar';
import EnhancedAIAssistant from './EnhancedAIAssistant';

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

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = "Start writing something amazing..." }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [assistantPosition, setAssistantPosition] = useState<{ x: number; y: number } | undefined>();

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

  const handleTextSelection = useCallback(() => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      const selectedText = Editor.string(editor, selection);
      setSelectedText(selectedText);
      
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setAssistantPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
      }
    } else {
      setSelectedText('');
    }
  }, [editor]);

  const handleAIInsert = useCallback((text: string) => {
    const { selection } = editor;
    if (selection) {
      Transforms.insertText(editor, `\n\n${text}`, { at: selection });
    }
  }, [editor]);

  const handleAIReplace = useCallback((text: string) => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      Transforms.delete(editor, { at: selection });
      Transforms.insertText(editor, text, { at: selection });
    }
  }, [editor]);

  const handleFormatClick = useCallback((formatId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    const textFormats = ['bold', 'italic', 'underline', 'code'];
    const blockFormats = ['heading-one', 'heading-two', 'block-quote', 'numbered-list', 'bulleted-list'];
    
    if (textFormats.includes(formatId)) {
      toggleMark(editor, formatId as keyof CustomText);
    } else if (blockFormats.includes(formatId)) {
      toggleBlock(editor, formatId as CustomElement['type']);
    }
  }, [editor]);

  const getActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    // Check text formatting
    const marks = Editor.marks(editor);
    if (marks) {
      Object.keys(marks).forEach(mark => {
        if (marks[mark]) formats.add(mark);
      });
    }
    
    // Check block formatting
    const { selection } = editor;
    if (selection) {
      const [match] = Array.from(
        Editor.nodes(editor, {
          at: Editor.unhangRange(editor, selection),
          match: n => !Editor.isEditor(n) && SlateElement.isElement(n),
        })
      );
      
      if (match) {
        const [node] = match;
        const element = node as CustomElement;
        formats.add(element.type);
      }
    }
    
    return formats;
  }, [editor]);

  return (
    <>
      <div className="border-2 border-blue-200/50 rounded-2xl shadow-large overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 backdrop-blur-sm">
        <SmartToolbar
          onFormatClick={handleFormatClick}
          onAIClick={() => setShowAIAssistant(true)}
          activeFormats={getActiveFormats()}
          selectedText={selectedText}
        />

        <div className="editor-content p-8 min-h-[500px] max-h-[700px] overflow-y-auto">
          <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              className="focus:outline-none prose prose-lg max-w-none text-gray-800 leading-relaxed"
              spellCheck
              onSelect={handleTextSelection}
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
                
                if (event.ctrlKey && event.key === '/') {
                  event.preventDefault();
                  setShowAIAssistant(true);
                }
              }}
            />
          </Slate>
        </div>
      </div>

      <EnhancedAIAssistant
        selectedText={selectedText}
        onTextInsert={handleAIInsert}
        onTextReplace={handleAIReplace}
        isVisible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        position={assistantPosition}
      />
    </>
  );
};

export default RichTextEditor;
