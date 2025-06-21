
import React, { useMemo } from 'react';
import {
  createSlateEditor,
  PlateProvider,
  Plate,
  SlatePlugins,
} from '@udecode/plate';
import {
  BaseBasicElementsPlugin,
} from '@udecode/plate-basic-elements';
import {
  BaseBasicMarksPlugin,
} from '@udecode/plate-basic-marks';
import {
  BaseListPlugin,
} from '@udecode/plate-list';
import PlateToolbar from './PlateToolbar';

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

  const editor = useMemo(
    () =>
      createSlateEditor({
        plugins: SlatePlugins([
          BaseBasicElementsPlugin(),
          BaseBasicMarksPlugin(),
          BaseListPlugin(),
        ]),
        value: initialValue,
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
      <PlateProvider editor={editor} onChange={handleChange}>
        {!isFocusMode && (
          <div className="border-b border-white/10 p-2">
            <PlateToolbar />
          </div>
        )}
        
        <div className="flex-1 relative overflow-hidden">
          <Plate
            className="h-full overflow-y-auto px-4 py-2 prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] focus:outline-none bg-transparent text-white"
            placeholder="Start writing your note..."
          />
        </div>
      </PlateProvider>
    </div>
  );
};

export default PlateEditor;
