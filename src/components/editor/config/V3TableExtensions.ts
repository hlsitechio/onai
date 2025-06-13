
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { getBaseConfig } from './V3BaseConfig';

export const getTableExtensions = () => {
  const baseConfig = getBaseConfig();

  return [
    Table.configure({
      ...baseConfig,
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 100,
      allowTableNodeSelection: true,
      HTMLAttributes: {
        class: 'border-collapse w-full table-fixed my-6 bg-black/80 rounded-lg overflow-hidden border-2 border-white/50 backdrop-blur-sm isolate',
        role: 'table',
        style: 'position: relative; z-index: 1; contain: layout style paint;'
      }
    }),

    TableRow.configure({
      HTMLAttributes: {
        class: 'border-b border-white/50 hover:bg-white/20 transition-colors',
        role: 'row',
        style: 'position: relative; contain: layout;'
      }
    }),

    TableHeader.configure({
      HTMLAttributes: {
        class: 'bg-white/30 font-bold p-4 border border-white/60 text-left text-white text-sm font-semibold',
        role: 'columnheader',
        scope: 'col',
        style: 'position: relative; contain: layout style;'
      }
    }),

    TableCell.configure({
      HTMLAttributes: {
        class: 'p-4 border border-white/50 text-white bg-black/60 text-sm leading-normal',
        role: 'cell',
        style: 'position: relative; contain: layout style; overflow: hidden; word-wrap: break-word;'
      }
    })
  ];
};
