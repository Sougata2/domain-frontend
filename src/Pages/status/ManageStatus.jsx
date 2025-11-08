import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { LuTrash } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CiEdit } from "react-icons/ci";
import { toast } from "sonner";
import { Link } from "react-router";

import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";

export default function ManageStatus() {
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "postDescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status Post Description
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("postDescription")}</div>;
      },
    },
    {
      accessorKey: "isFinal",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Is Final
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            {row.getValue("isFinal") === true && (
              <IoMdCheckmarkCircleOutline
                size={17}
                className="text-emerald-500"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "actionType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Action Type
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("actionType")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div>Actions</div>;
      },
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
                  <Link to={`/edit-status/${row.getValue("id")}`}>Edit</Link>
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
    },
  ];

  const [statuses, setStatuses] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const fetchStatuses = useCallback(async () => {
    try {
      const response = await axios.get("/status/all");
      const data = response.data;
      setStatuses(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchStatuses();
    })();
  }, [fetchStatuses]);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/status", {
        data: { id },
      });
      setDeleteId("");
      await fetchStatuses();
      toast.warning("Deleted", { description: "Status Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <ConfirmationAlert
        isOpen={openAlert}
        closeHandler={() => setOpenAlert(false)}
        handleConfirm={() => {
          handleDelete(deleteId);
          setOpenAlert(false);
        }}
      />
      <div>
        <DataTable
          columns={columns}
          data={statuses}
          options={{ searchField: "postDescription" }}
        />
      </div>
    </div>
  );
}
