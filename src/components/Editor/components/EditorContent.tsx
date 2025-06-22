
import React, { useCallback } from 'react';
import { Slate, Editable } from 'slate-react';
import { Editor } from 'slate';
import { SlateValue } from '../types';
import ElementRenderer from '../rendering/ElementRenderer';
import LeafRenderer from '../rendering/LeafRenderer';

interface EditorContentProps {
  editor: Editor;
  slateValue: SlateValue;
  onChange: (value: any[]) => void;
  placeholder: string;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onAIToggle: () => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  editor,
  slateValue,
  onChange,
  placeholder,
  onSelect,
  onKeyDown,
  onAIToggle,
}) => {
  const renderElement = useCallback((props: any) => <ElementRenderer {...props} />, []);
  const renderLeaf = useCallback((props: any) => <LeafRenderer {...props} />, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    onKeyDown(event);
    
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault();
      onAIToggle();
    }
  }, [onKeyDown, onAIToggle]);

  return (
    <div className="editor-content p-8 min-h-[500px] max-h-[700px] overflow-y-auto bg-white/5 backdrop-blur-sm dark:bg-slate-900/20">
      <Slate editor={editor} initialValue={slateValue} onValueChange={onChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          className="focus:outline-none prose prose-lg max-w-none text-gray-800 leading-relaxed dark:text-slate-200 dark:placeholder-slate-500"
          spellCheck
          onSelect={onSelect}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </div>
  );
};

export default EditorContent;
