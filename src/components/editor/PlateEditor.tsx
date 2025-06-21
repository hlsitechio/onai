
import React, { useMemo } from 'react';
import { Plate, PlateContent, createPlateEditor } from '@udecode/plate-common/react';
import { createBasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { createBasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { createListPlugin } from '@udecode/plate-list/react';
import PlateToolbar from './PlateToolbar';

interface PlateEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const plugins = [
  createBasicElementsPlugin(),
  createBasicMarksPlugin(),
  createListPlugin(),
];

const PlateEditor: React.FC<PlateEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
}) => {
  const initialValue = useMemo(() => {
    try {
      return content ? JSON.parse(content) : [{ 
        type: 'p', 
        children: [{ text: '' }] 
      }];
    } catch (error) {
      console.warn('Failed to parse content, using default:', error);
      return [{ 
        type: 'p', 
        children: [{ text: content || '' }] 
      }];
    }
  }, [content]);

  const editor = useMemo(() => 
    createPlateEditor({ 
      plugins,
      value: initialValue
    }), 
    [initialValue]
  );

  const handleChange = (value: any) => {
    try {
      setContent(JSON.stringify(value));
    } catch (error) {
      console.error('Failed to serialize content:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
      <Plate 
        editor={editor}
        onChange={handleChange}
      >
        {!isFocusMode && (
          <div className="border-b border-white/10 p-2">
            <PlateToolbar />
          </div>
        )}
        
        <div className="flex-1 relative overflow-hidden">
          <PlateContent
            className="h-full overflow-y-auto px-4 py-2 prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] focus:outline-none bg-transparent text-white"
            placeholder="Start writing your note..."
          />
        </div>
      </Plate>
    </div>
  );
};

export default PlateEditor;
