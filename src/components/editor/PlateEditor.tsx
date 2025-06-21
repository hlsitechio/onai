
import React, { useMemo } from 'react';
import { Plate, PlateContent } from '@udecode/plate-common';
import { createPlateEditor } from '@udecode/plate-common';
import { createBasicElementsPlugin } from '@udecode/plate-basic-elements';
import { createBasicMarksPlugin } from '@udecode/plate-basic-marks';
import { createAlignPlugin } from '@udecode/plate-alignment';
import { createListPlugin } from '@udecode/plate-list';
import { createLinkPlugin } from '@udecode/plate-link';
import { createMediaEmbedPlugin } from '@udecode/plate-media';
import { createSelectOnBackspacePlugin } from '@udecode/plate-select';
import { createNodeIdPlugin } from '@udecode/plate-node-id';
import { createNormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-basic-elements';
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
  const plugins = useMemo(() => [
    createNodeIdPlugin(),
    createBasicElementsPlugin(),
    createBasicMarksPlugin(),
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH],
        },
      },
    }),
    createListPlugin(),
    createLinkPlugin(),
    createMediaEmbedPlugin(),
    createSelectOnBackspacePlugin(),
    createNormalizeTypesPlugin(),
    createResetNodePlugin(),
    createTrailingBlockPlugin(),
  ], []);

  const editor = useMemo(() => 
    createPlateEditor({ 
      plugins,
      value: content ? JSON.parse(content) : [{ type: 'p', children: [{ text: '' }] }]
    }), 
    [plugins]
  );

  const handleChange = (value: any) => {
    setContent(JSON.stringify(value));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#03010a] to-[#0a0518] text-white">
      {!isFocusMode && (
        <div className="border-b border-white/10 p-2">
          <PlateToolbar />
        </div>
      )}
      
      <div className="flex-1 relative overflow-hidden">
        <Plate 
          editor={editor} 
          onChange={handleChange}
          initialValue={content ? JSON.parse(content) : [{ type: 'p', children: [{ text: '' }] }]}
        >
          <PlateContent
            className="h-full overflow-y-auto px-4 py-2 prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] focus:outline-none"
            placeholder="Start writing your note..."
          />
        </Plate>
      </div>
    </div>
  );
};

export default PlateEditor;
