import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/DomainComponents/DataTable";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import { Button } from "@/components/ui/button";

function ManageLab() {
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
            Labs
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("email")}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("phone")}</div>;
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
                  <Link to={`/edit-lab/${row.getValue("id")}`}>Edit</Link>
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
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [labs, setLabs] = useState([]);

  const fetchLabs = useCallback(async () => {
    try {
      const response = await axios.get("/lab/all");
      const data = response.data;
      setLabs(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchLabs();
    })();
  }, [fetchLabs]);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/lab", {
        data: { id },
      });
      setDeleteId("");
      await fetchLabs();
      toast.warning("Deleted", { description: "Lab Data Deleted" });
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
      <div className="max-w-5xl">
        <DataTable
          columns={columns}
          data={labs}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}

export default ManageLab;
