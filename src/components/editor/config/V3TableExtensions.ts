
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
        class: 'border-collapse w-full table-auto my-4 bg-white/10 rounded-lg overflow-hidden border border-white/30',
        role: 'table'
      }
    }),

    TableRow.configure({
      HTMLAttributes: {
        class: 'border-b border-white/30 hover:bg-white/10 transition-colors',
        role: 'row'
      }
    }),

    TableHeader.configure({
      HTMLAttributes: {
        class: 'bg-white/20 font-bold p-4 border border-white/40 text-left text-white min-w-[120px] text-sm',
        role: 'columnheader',
        scope: 'col'
      }
    }),

    TableCell.configure({
      HTMLAttributes: {
        class: 'p-4 border border-white/30 text-white min-w-[120px] bg-white/5 text-sm leading-relaxed',
        role: 'cell'
      }
    })
  ];
};
