import TanstackTable from "@/components/TanstackTable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertButton } from "@/DomainComponents/AlertBox";
import axios from "axios";
import { Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { toast } from "sonner";

function ManageWorkFlowActionGroup() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <div>Group Name</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "subServices",
        header: () => <div>Sub Services</div>,
        cell: (row) => (
          <div className="flex gap-1.5">
            {row.getValue().map((s) => (
              <Badge>{s.name}</Badge>
            ))}
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
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
                    <Link to={`/edit-workflow-group/${row.getValue("id")}`}>
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
      const _ = await axios.delete("/workflow-group", {
        data: { id },
      });
      setRefreshKey((prev) => prev + 1);
      toast.warning("Deleted", { description: "WorkFlow Group Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <TanstackTable
        columns={columns}
        postURL={"/workflow-group/search"}
        refreshKey={refreshKey}
      />
    </div>
  );
}

export default ManageWorkFlowActionGroup;
