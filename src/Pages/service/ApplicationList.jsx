import DataTable from "@/components/DataTable";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaRegFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { FiTrash } from "react-icons/fi";
import { useState } from "react";
import { toast } from "sonner";

import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

function ApplicationList() {
  const navigate = useNavigate();
  const { id: userId } = useSelector((state) => state.user);

  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [doRefresh, setDoRefresh] = useState(false);
  const [status, setStatus] = useState("AG");

  const columns = [
    {
      accessorKey: "referenceNumber",
      header: () => {
        return (
          <div>
            <Button variant="ghost">Reference Number</Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize ps-3">
            {row.getValue("referenceNumber")}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(undefined, false)}
            >
              Status
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize ps-3">
            {row.getValue("status")?.postDescription}{" "}
            {status === "AS" &&
              row.original.assignee.id === userId &&
              !row.original.status.isFinal && (
                <Badge
                  variant={"secondary"}
                  className="bg-amber-200 text-amber-600 dark:bg-amber-300"
                >
                  Action Required
                </Badge>
              )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "service",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(undefined, false)}
            >
              Service
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize ps-3">{row.getValue("service")?.name}</div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "subService",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(undefined, false)}
            >
              Sub Service
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize ps-3">
            {row.getValue("subService")?.name}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(undefined, false)}
            >
              Request Date
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize ps-3">
            {format(new Date(row.getValue("createdAt")), "dd MMM yyy")}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "requestime",
      header: () => {
        return (
          <div>
            <Button variant="ghost">Request Time</Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize ps-3">
            {format(new Date(row.getValue("createdAt")), "hh:mm bb")}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      enableHiding: false,
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FaRegFolderOpen />
                {status === "AG" && (
                  <button
                    onClick={() => {
                      navigate(
                        `/new-request/${row.getValue("referenceNumber")}`
                      );
                    }}
                  >
                    View
                  </button>
                )}

                {status === "AS" && (
                  <button
                    onClick={() => {
                      navigate(`/task-view/${row.getValue("referenceNumber")}`);
                    }}
                  >
                    View
                  </button>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FiTrash />
                <button
                  onClick={() => {
                    setOpenAlert(true);
                    setDeleteId(row.getValue("id"));
                  }}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/application", {
        data: { id },
      });
      setDeleteId("");
      setDoRefresh(true);
      toast.warning("Deleted", { description: "Application Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center flex-col gap-3">
      <ConfirmationAlert
        isOpen={openAlert}
        closeHandler={() => setOpenAlert(false)}
        handleConfirm={() => {
          handleDelete(deleteId);
          setOpenAlert(false);
        }}
      />

      <div className="flex flex-col gap-3">
        <Select onValueChange={(value) => setStatus(value)} value={status}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="AG">Application Generated</SelectItem>
              <SelectItem value="AS">Application Submitted</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {status === "AG" && (
          <DataTable
            columns={columns}
            api={`/application/by-status-and-user-id?user=${userId}&status=${status}`}
            checkBeforeFetchData={userId}
            triggerRefresh={doRefresh}
            setTriggerRefresh={setDoRefresh}
          />
        )}
        {status === "AS" && (
          <DataTable
            columns={columns}
            api={`/application/applicant-submitted-application/${userId}?`}
            checkBeforeFetchData={userId}
            triggerRefresh={doRefresh}
            setTriggerRefresh={setDoRefresh}
          />
        )}
      </div>
    </div>
  );
}

export default ApplicationList;
