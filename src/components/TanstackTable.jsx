import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiCaretUpDownBold } from "react-icons/pi";
import { MdKeyboardArrowUp } from "react-icons/md";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";

import axios from "axios";

function TanstackTable({ columns, postURL, refreshKey = 0 }) {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${postURL}?page=${pagination.pageIndex}&size=${pagination.pageSize}${
          sorting.length > 0
            ? "&sort=" +
              sorting
                .map((s) => `${s.id},${s.desc ? "desc" : "asc"}`)
                .join("&sort=")
            : ""
        }`,
        Object.fromEntries(
          filters.map((f) => [f.id.split("_").join("."), f.value])
        )
      );
      setData(response.data.content);
      setPageCount(response.data.totalPages);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [postURL, pagination.pageIndex, pagination.pageSize, sorting, filters]);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData, refreshKey]);

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
                      <div className="flex flex-col gap-2">
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex"
                              : "flex",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                          {header.column.getCanSort() && (
                            <div className="flex gap-1 items-center">
                              {{
                                asc: <MdKeyboardArrowUp className="ms-1" />,
                                desc: <MdKeyboardArrowDown className="ms-1" />,
                              }[header.column.getIsSorted()] ?? (
                                <PiCaretUpDownBold className="ms-1" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mb-2">
                          {header.column.getCanFilter() ? (
                            <DebouncedInput
                              placeholder={"Search..."}
                              value={header.column.getFilterValue()}
                              onChange={header.column.setFilterValue}
                            />
                          ) : null}
                        </div>
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

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default TanstackTable;
