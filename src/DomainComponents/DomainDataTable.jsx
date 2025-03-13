import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function DomainDataTable({ users }) {
  const { t } = useTranslation();
  const columns = [
    {
      accessorKey: "firstName",
      header: () => {
        return <div>{t("First Name")}</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <Link to={`/user/${row.original.id}`}>
            {row.getValue("firstName")}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Last Name")}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="">{row.getValue("lastName")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-right">{t("Email")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">{row.getValue("email")}</div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="text-center">{t("Actions")}</div>,
      cell: ({ row }) => {
        return (
          <div className={"flex justify-center gap-2.5"}>
            <Button className={"bg-emerald-400 hover:bg-emerald-600"}>
              <Link to={`/edit/${row.original.id}`}>{t("Edit")}</Link>
            </Button>
            <Button className={"bg-red-400 hover:bg-red-500"}>
              <Link to={`/delete/${row.original.id}`}>{t("Delete")}</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="w-full px-28 h-full">
      <div className="flex items-center py-4 gap-3.5">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          className={"bg-blue-400 hover:bg-blue-500"}
          onClick={() => navigate("/add")}
        >
          {t("Add")}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
