
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

export const getTableExtensions = () => [
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'border-collapse border border-white/20 w-full my-4',
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: 'border-b border-white/10',
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: 'border border-white/20 bg-white/5 p-2 font-semibold text-left',
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: 'border border-white/20 p-2',
    },
  }),
];
