
import React from 'react';
import PlateEditor from './PlateEditor';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  collaborative?: boolean;
  enhanced?: boolean;
  roomId?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  content,
  setContent,
  isFocusMode = false,
  // These props are now ignored as we've removed Tiptap/collaboration features
  collaborative = false,
  enhanced = false,
  roomId
}) => {
  return (
    <PlateEditor
      content={content}
      setContent={setContent}
      isFocusMode={isFocusMode}
    />
  );
};

export default TiptapEditor;
