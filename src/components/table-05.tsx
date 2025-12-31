"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  RotateCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Table05Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  headerActions?: React.ReactNode;
  manualPagination?: {
    pageCount: number;
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export function Table05<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  headerActions,
  manualPagination
}: Table05Props<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    manualPagination: !!manualPagination,
    pageCount: manualPagination?.pageCount ?? -1,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      ...(manualPagination ? {
        pagination: {
          pageIndex: manualPagination.currentPage - 1,
          pageSize: manualPagination.pageSize,
        },
      } : {}),
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const currentPage = manualPagination ? manualPagination.currentPage : table.getState().pagination.pageIndex + 1;
  const pageCount = manualPagination ? manualPagination.pageCount : table.getPageCount();
  const pageSize = manualPagination ? manualPagination.pageSize : table.getState().pagination.pageSize;
  const totalItems = manualPagination ? manualPagination.totalItems : table.getCoreRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-iron-grey-400" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10 bg-prussian-blue-900 border-prussian-blue-800 text-platinum-50 focus-visible:ring-jungle-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-prussian-blue-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-prussian-blue-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-prussian-blue-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-iron-grey-300">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-prussian-blue-900/50 hover:bg-prussian-blue-800/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-iron-grey-400"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-iron-grey-400">
          Mostrando {manualPagination ? (currentPage - 1) * pageSize + 1 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} para{" "}
          {manualPagination ? Math.min(currentPage * pageSize, totalItems) : Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalItems)} de{" "}
          {totalItems} registros
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-iron-grey-400">Linhas por página</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newSize = Number(value);
                if (manualPagination) {
                  manualPagination.onPageSizeChange(newSize);
                } else {
                  table.setPageSize(newSize);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-prussian-blue-900 border-prussian-blue-800">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top" className="bg-prussian-blue-900 border-prussian-blue-800">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="focus:bg-prussian-blue-800 focus:text-jungle-green-400">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-iron-grey-400">
            Página {currentPage} de {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-prussian-blue-900 border-prussian-blue-800 hover:bg-prussian-blue-800"
              onClick={() => manualPagination ? manualPagination.onPageChange(1) : table.setPageIndex(0)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Ir para a primeira página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-prussian-blue-900 border-prussian-blue-800 hover:bg-prussian-blue-800"
              onClick={() => manualPagination ? manualPagination.onPageChange(currentPage - 1) : table.previousPage()}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Ir para a página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-prussian-blue-900 border-prussian-blue-800 hover:bg-prussian-blue-800"
              onClick={() => manualPagination ? manualPagination.onPageChange(currentPage + 1) : table.nextPage()}
              disabled={currentPage >= pageCount}
            >
              <span className="sr-only">Ir para a próxima página</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-prussian-blue-900 border-prussian-blue-800 hover:bg-prussian-blue-800"
              onClick={() => manualPagination ? manualPagination.onPageChange(pageCount) : table.setPageIndex(table.getPageCount() - 1)}
              disabled={currentPage >= pageCount}
            >
              <span className="sr-only">Ir para a última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
