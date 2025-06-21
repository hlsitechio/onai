
import React from 'react';
import UnifiedEditor from './UnifiedEditor';
import SimpleToolbar from './SimpleToolbar';

interface PlateEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const PlateEditor: React.FC<PlateEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
}) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
      {!isFocusMode && (
        <div className="border-b border-white/10 p-2">
          <SimpleToolbar />
        </div>
      )}
      
      <UnifiedEditor
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
      />
    </div>
  );
};

export default PlateEditor;
