import TanstackTable from "@/components/TanstackTable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
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
          <div>
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
                    <Link to={`/edit-workflow/${row.getValue("id")}`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LuTrash />
                    <button
                      onClick={() => {
                        setOpenAlert(true);
                        setDeleteId(row.getValue("id"));
                      }}
                    >
                      Delete
                    </button>
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
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/workflow-group", {
        data: { id },
      });
      setDeleteId("");
      setRefreshKey((prev) => prev + 1);
      toast.warning("Deleted", { description: "WorkFlow Group Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <ConfirmationAlert
        isOpen={openAlert}
        closeHandler={() => setOpenAlert(false)}
        handleConfirm={() => {
          handleDelete(deleteId);
          setOpenAlert(false);
        }}
      />
      <div>
        <TanstackTable
          columns={columns}
          postURL={"/workflow-group/search"}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
}

export default ManageWorkFlowActionGroup;
