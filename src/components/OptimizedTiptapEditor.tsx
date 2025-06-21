
import React from 'react';
import PlateEditor from './editor/PlateEditor';

interface OptimizedTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const OptimizedTiptapEditor: React.FC<OptimizedTiptapEditorProps> = (props) => {
  return <PlateEditor {...props} />;
};

export default OptimizedTiptapEditor;
