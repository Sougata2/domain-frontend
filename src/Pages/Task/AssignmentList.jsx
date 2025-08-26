import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { BiTask } from "react-icons/bi";
import { Link } from "react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import TanstackTable from "@/components/TanstackTable";
import { useSelector } from "react-redux";

function AssignmentList() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "referenceNumber",
        header: () => <div>Status</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "service.name",
        header: () => <div>Target Status</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "subService.name",
        header: () => <div>Target Role</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "createdAt",
        header: () => <div>Request Date</div>,
        cell: (row) => (
          <div>{format(new Date(row.getValue()), "dd-MM-yyyy")}</div>
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
                    <BiTask />
                    <Link to={`/task-view/${row.getValue("referenceNumber")}`}>
                      View
                    </Link>
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

  const { id: userId } = useSelector((state) => state.user);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/application", {
        data: { id },
      });
      setDeleteId("");
      setRefreshKey((prev) => prev + 1);
      toast.warning("Deleted", { description: "Application Deleted" });
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
      {userId && (
        <TanstackTable
          columns={columns}
          postURL={`/application/search`}
          refreshKey={refreshKey}
          extraFilters={{ "assignee.id": userId }}
        />
      )}
    </div>
  );
}

export default AssignmentList;
