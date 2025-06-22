
import React, { useState } from 'react';
import SmartToolbar from './SmartToolbar';
import EnhancedAIAssistant from './EnhancedAIAssistant';
import TextSelectionContextMenu from './TextSelectionContextMenu';
import EditorContent from './components/EditorContent';
import { useRichTextEditor } from './hooks/useRichTextEditor';
import { useTextSelection } from './hooks/useTextSelection';
import { useEditorFormatting } from './hooks/useEditorFormatting';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing something amazing...",
  onSave,
  canSave = true,
  isSaving = false
}) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Custom hooks for editor functionality
  const {
    editor,
    slateValue,
    handleChange,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
  } = useRichTextEditor({ value, onChange });

  const {
    selectedText,
    assistantPosition,
    contextMenuPosition,
    handleTextSelection,
    handleContextMenuReplace,
    closeContextMenu,
  } = useTextSelection(editor);

  const {
    handleFormatClick,
    getActiveFormats,
    handleKeyboardShortcuts,
  } = useEditorFormatting(editor);

  return (
    <>
      <div className="glass rounded-2xl shadow-large overflow-hidden bg-white/10 backdrop-blur-lg dark:bg-slate-800/20">
        <SmartToolbar
          onFormatClick={handleFormatClick}
          onAIClick={() => setShowAIAssistant(true)}
          onSave={onSave || (() => {})}
          onTextInsert={handleTextInsert}
          activeFormats={getActiveFormats()}
          selectedText={selectedText}
          canSave={canSave}
          isSaving={isSaving}
        />

        <EditorContent
          editor={editor}
          slateValue={slateValue}
          onChange={handleChange}
          placeholder={placeholder}
          onSelect={handleTextSelection}
          onKeyDown={handleKeyboardShortcuts}
          onAIToggle={() => setShowAIAssistant(true)}
        />
      </div>

      {/* Context Menu for Text Selection */}
      <TextSelectionContextMenu
        selectedText={selectedText}
        onTextReplace={handleContextMenuReplace}
        onTextInsert={handleAIInsert}
        position={contextMenuPosition}
        onClose={closeContextMenu}
      />

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
