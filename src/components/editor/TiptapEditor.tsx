
import React from 'react';
import OptimizedTiptapEditor from './OptimizedTiptapEditor';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = (props) => {
  return <OptimizedTiptapEditor {...props} />;
};

export default TiptapEditor;
