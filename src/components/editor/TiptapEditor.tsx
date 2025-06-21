import React from 'react';
import OptimizedTiptapEditor from './OptimizedTiptapEditor';
import LiveblocksEditorWrapper from './LiveblocksEditorWrapper';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  collaborative?: boolean;
  roomId?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  collaborative = false, 
  roomId,
  ...props 
}) => {
  // If collaborative mode is enabled, use Liveblocks wrapper
  if (collaborative) {
    return (
      <LiveblocksEditorWrapper
        {...props}
        roomId={roomId}
      />
    );
  }

  // Otherwise, use the standard editor
  return <OptimizedTiptapEditor {...props} />;
};

export default TiptapEditor;
