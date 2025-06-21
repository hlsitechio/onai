
import React from 'react';
import OptimizedTiptapEditor from './OptimizedTiptapEditor';
import LiveblocksEditorWrapper from './LiveblocksEditorWrapper';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  collaborative?: boolean;
  enhanced?: boolean; // New prop for enhanced features without collaboration
  roomId?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  collaborative = false,
  enhanced = false,
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

  // If enhanced mode is enabled, use enhanced wrapper without collaboration
  if (enhanced) {
    return (
      <LiveblocksEditorWrapper
        {...props}
        roomId={roomId}
        enhanced={true}
      />
    );
  }

  // Otherwise, use the standard editor
  return <OptimizedTiptapEditor {...props} />;
};

export default TiptapEditor;
