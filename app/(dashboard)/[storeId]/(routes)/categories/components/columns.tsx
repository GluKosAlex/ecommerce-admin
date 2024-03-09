'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'billboard',
    header: 'Billboard',
    cell: ({ row }) => row.original.billboardLabel, // render the billboard label
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
