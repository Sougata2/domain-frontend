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
import { FaRegFolderOpen } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router";

function ApplicationList() {
  const navigate = useNavigate();
  const { id: userId } = useSelector((state) => state.user);

  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [doRefresh, setDoRefresh] = useState(false);

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
                <button
                  onClick={() => {
                    navigate(`/new-request/${row.getValue("referenceNumber")}`);
                  }}
                >
                  View
                </button>
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
      <DataTable
        columns={columns}
        api={`/application/by-status-and-user-id?user=${userId}&status=${"AG"}`}
        checkBeforeFetchData={userId}
        triggerRefresh={doRefresh}
        setTriggerRefresh={setDoRefresh}
      />
    </div>
  );
}

export default ApplicationList;
