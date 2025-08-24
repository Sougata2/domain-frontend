import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

import { PiCaretUpDownBold } from "react-icons/pi";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Input } from "./ui/input";

function TanstackTable() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "status.name",
        header: () => <div>Status</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "targetStatus.name",
        header: () => <div>Target Status</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "targetRole.name",
        header: () => <div>Target Role</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "movement",
        header: () => <div>Movement</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "name",
        header: () => <div>Action</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
    ],
    []
  );

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(
        `/workflow-action/search?page=${pagination.pageIndex}&size=${
          pagination.pageSize
        }${
          sorting.length > 0
            ? "&sort=" +
              sorting
                .map((s) => `${s.id},${s.desc ? "desc" : "asc"}`)
                .join("&sort=")
            : ""
        }`,
        Object.fromEntries(filters.map((f) => [f.id, f.value]))
      );
      setData(response.data.content);
      setPageCount(response.data.totalPages);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [pagination, sorting, filters]);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters: filters,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border w-3xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div
                        className="flex"
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        <div className="flex gap-1 items-center">
                          {{
                            asc: <MdKeyboardArrowUp className="ms-1" />,
                            desc: <MdKeyboardArrowDown className="ms-1" />,
                          }[header.column.getIsSorted()] ?? (
                            <PiCaretUpDownBold className="ms-1" />
                          )}
                        </div>
                      </div>
                      <div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Input />
                          </div>
                        ) : null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="py-3 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm ms-2">
          Page <span className="font-bold">{pagination.pageIndex + 1}</span> of{" "}
          <span className="font-bold">{pageCount}</span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TanstackTable;
