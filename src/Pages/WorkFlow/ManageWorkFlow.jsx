import TanstackTable from "@/components/TanstackTable";
import { useMemo } from "react";

function ManageWorkFlow() {
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
      {
        accessorKey: "id",
        header: () => <div></div>,
        cell: (row) => <div>actions</div>,
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <div className="flex justify-center items-center">
      <TanstackTable columns={columns} postURL={"/workflow-action/search"} />
    </div>
  );
}

export default ManageWorkFlow;
