
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
  // Ignoring collaborative features for now as we're migrating to Plate
  collaborative = false,
  enhanced = false,
  roomId
}) => {
  // Use Plate editor for all modes now
  return (
    <PlateEditor
      content={content}
      setContent={setContent}
      isFocusMode={isFocusMode}
    />
  );
};

export default TiptapEditor;
