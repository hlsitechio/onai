
import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Descendant, Editor, Transforms, Range, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import SmartToolbar from './SmartToolbar';
import EnhancedAIAssistant from './EnhancedAIAssistant';
import ElementRenderer from './rendering/ElementRenderer';
import LeafRenderer from './rendering/LeafRenderer';
import { CustomText, CustomElement, SlateValue } from './types';
import { 
  toggleMark, 
  toggleBlock, 
  isMarkActive, 
  isBlockActive, 
  parseInitialValue 
} from './utils/editorUtils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing something amazing..." 
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [assistantPosition, setAssistantPosition] = useState<{ x: number; y: number } | undefined>();

  // Parse the value from string to Slate value
  const initialValue: Descendant[] = useMemo(() => parseInitialValue(value), [value]);
  const [slateValue, setSlateValue] = useState<SlateValue>(initialValue);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setSlateValue(newValue);
    // Convert Slate value to string for storage
    onChange(JSON.stringify(newValue));
  }, [onChange]);

  const renderElement = useCallback((props: any) => <ElementRenderer {...props} />, []);
  const renderLeaf = useCallback((props: any) => <LeafRenderer {...props} />, []);

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
      <div className="border-2 border-blue-200/50 rounded-2xl shadow-large overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 backdrop-blur-sm dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-700/80 dark:border-slate-600/50">
        <SmartToolbar
          onFormatClick={handleFormatClick}
          onAIClick={() => setShowAIAssistant(true)}
          activeFormats={getActiveFormats()}
          selectedText={selectedText}
        />

        <div className="editor-content p-8 min-h-[500px] max-h-[700px] overflow-y-auto bg-white/50 dark:bg-slate-900/70">
          <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              className="focus:outline-none prose prose-lg max-w-none text-gray-800 leading-relaxed dark:text-slate-200 dark:placeholder-slate-500"
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
