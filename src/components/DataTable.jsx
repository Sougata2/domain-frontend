import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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

function DataTable({
  columns,
  api,
  checkBeforeFetchData,
  triggerRefresh,
  setTriggerRefresh,
}) {
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    onSortingChange: (updater) => {
      if (sorting.length === 0) {
        const updated =
          typeof updater === "function" ? updater(sorting) : updater;
        const inverted = updated.map((u) => {
          return {
            ...u,
            desc: !u.desc,
          };
        });
        setSorting(inverted);
      } else {
        const inverted = sorting.map((u) => {
          return {
            ...u,
            desc: !u.desc,
          };
        });
        setSorting(inverted);
      }
    },
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const fetchData = useCallback(
    async (sortParams) => {
      try {
        const response = await axios.get(
          `${api}&page=${pageIndex}&size=${pageSize}&${sortParams}`
        );
        const data = response.data;
        setData(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setTriggerRefresh(false);
      } catch (error) {
        console.log(error);
        toast.error("Error", { description: error.message });
      }
    },
    [api, pageIndex, pageSize, setTriggerRefresh]
  );

  useEffect(() => {
    if (checkBeforeFetchData) {
      (async () => {
        const sortParams =
          sorting.length > 0
            ? sorting
                .map((s) => `sort=${s.id},${s.desc ? "desc" : "asc"}`)
                .join("&")
            : "";
        await fetchData(sortParams);
      })();
    }
  }, [checkBeforeFetchData, fetchData, sorting]);

  useEffect(() => {
    (async () => {
      if (triggerRefresh) {
        await fetchData();
      }
    })();
  }, [fetchData, triggerRefresh]);

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
          Showing {pageIndex * pageSize + 1} to {pageIndex + pageSize} of{" "}
          {totalElements} entries
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

export default DataTable;
