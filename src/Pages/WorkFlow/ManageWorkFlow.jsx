import TanstackTable from "@/components/TanstackTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertButton } from "@/DomainComponents/AlertBox";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import axios from "axios";
import { Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { toast } from "sonner";

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
        accessorKey: "type",
        header: () => <div>Action Type</div>,
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
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CiEdit />
                    <Link to={`/edit-workflow/${row.getValue("id")}`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LuTrash />
                    <AlertButton
                      onConfirm={() => handleDelete(row.getValue("id"))}
                    >
                      Delete
                    </AlertButton>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/workflow-action", {
        data: { id },
      });
      setRefreshKey((prev) => prev + 1);
      toast.warning("Deleted", { description: "WorkFlow Action Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <TanstackTable
        columns={columns}
        postURL={"/workflow-action/search"}
        refreshKey={refreshKey}
      />
    </div>
  );
}

export default ManageWorkFlow;
