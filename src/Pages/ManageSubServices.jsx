import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
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

export default function ManageSubServices() {
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Sub Service Name
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize ps-3">{row.getValue("name")}</div>;
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
                  <Link to={`/edit-sub-service/${row.getValue("id")}`}>
                    Manage
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
    },
  ];

  const [subServices, setSubServices] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const fetchSubServices = useCallback(async () => {
    const response = await axios.get("/sub-service/all");
    const data = response.data;
    setSubServices(data);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchSubServices();
    })();
  }, [fetchSubServices]);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/sub-service", {
        data: { id },
      });
      setDeleteId("");
      await fetchSubServices();
      toast.warning("Deleted", { description: "Sub Service Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <ConfirmationAlert
        isOpen={openAlert}
        closeHandler={() => setOpenAlert(false)}
        handleConfirm={() => {
          handleDelete(deleteId);
          setOpenAlert(false);
        }}
      />
      <div className="w-2xl">
        <DataTable
          columns={columns}
          data={subServices}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}
