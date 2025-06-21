
import React, { useMemo } from 'react';
import { 
  Plate,
  PlateContent,
  createPlateEditor,
  PlateProvider
} from '@udecode/plate-common/react';
import { 
  BasicElementsPlugin
} from '@udecode/plate-basic-elements/react';
import { 
  BasicMarksPlugin
} from '@udecode/plate-basic-marks/react';
import { 
  ListPlugin
} from '@udecode/plate-list/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { MediaEmbedPlugin } from '@udecode/plate-media/react';
import { SelectOnBackspacePlugin } from '@udecode/plate-select';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { NormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { BaseResetNodePlugin } from '@udecode/plate-reset-node';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import PlateToolbar from './PlateToolbar';

interface PlateEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const plugins = [
  NodeIdPlugin,
  BasicElementsPlugin,
  BasicMarksPlugin,
  ListPlugin,
  LinkPlugin,
  MediaEmbedPlugin,
  SelectOnBackspacePlugin,
  NormalizeTypesPlugin,
  BaseResetNodePlugin,
  TrailingBlockPlugin,
];

const PlateEditor: React.FC<PlateEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
}) => {
  const editor = useMemo(() => 
    createPlateEditor({ 
      plugins,
      value: content ? JSON.parse(content) : [{ 
        type: 'p', 
        children: [{ text: '' }] 
      }]
    }), 
    []
  );

  const handleChange = (value: any) => {
    setContent(JSON.stringify(value));
  };

  const initialValue = content ? JSON.parse(content) : [{ 
    type: 'p', 
    children: [{ text: '' }] 
  }];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
      <PlateProvider
        plugins={plugins}
        initialValue={initialValue}
        onChange={handleChange}
      >
        {!isFocusMode && (
          <div className="border-b border-white/10 p-2">
            <PlateToolbar />
          </div>
        )}
        
        <div className="flex-1 relative overflow-hidden">
          <Plate editor={editor}>
            <PlateContent
              className="h-full overflow-y-auto px-4 py-2 prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] focus:outline-none bg-transparent text-white"
              placeholder="Start writing your note..."
            />
          </Plate>
        </div>
      </PlateProvider>
    </div>
  );
};

export default PlateEditor;
