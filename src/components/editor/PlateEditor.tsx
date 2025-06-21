
import React, { useMemo } from 'react';
import { PlateProvider, Plate } from '@udecode/plate-common/react';
import { createPlateEditor } from '@udecode/plate-common/react';
import { 
  BasicElementsPlugin,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3
} from '@udecode/plate-basic-elements/react';
import { 
  BasicMarksPlugin,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE
} from '@udecode/plate-basic-marks/react';
import { AlignPlugin } from '@udecode/plate-alignment/react';
import { 
  ListPlugin,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI
} from '@udecode/plate-list/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { MediaEmbedPlugin } from '@udecode/plate-media/react';
import { SelectOnBackspacePlugin } from '@udecode/plate-select';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { NormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { ResetNodePlugin } from '@udecode/plate-reset-node';
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
  AlignPlugin.configure({
    inject: {
      targetPlugins: [ELEMENT_PARAGRAPH],
    },
  }),
  ListPlugin,
  LinkPlugin,
  MediaEmbedPlugin,
  SelectOnBackspacePlugin,
  NormalizeTypesPlugin,
  ResetNodePlugin,
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
        type: ELEMENT_PARAGRAPH, 
        children: [{ text: '' }] 
      }]
    }), 
    []
  );

  const handleChange = (value: any) => {
    setContent(JSON.stringify(value));
  };

  const initialValue = content ? JSON.parse(content) : [{ 
    type: ELEMENT_PARAGRAPH, 
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
          <Plate>
            <div
              className="h-full overflow-y-auto px-4 py-2 prose prose-invert dark:prose-invert max-w-none outline-none min-h-[300px] focus:outline-none"
              data-plate-selectable
              data-slate-editor
              contentEditable
              suppressContentEditableWarning
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </Plate>
        </div>
      </PlateProvider>
    </div>
  );
};

export default PlateEditor;
