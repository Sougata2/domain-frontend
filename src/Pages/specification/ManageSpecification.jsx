import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

function ManageSpecification() {
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
            Specification
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("price")}</div>;
      },
    },
    {
      accessorKey: "activities",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Activity
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3 flex gap-1 flex-wrap">
            {row.getValue("activities").map((a) => (
              <Badge key={a.id} variant="secondary">
                {a.name}
              </Badge>
            ))}
          </div>
        );
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
                  <Link to={`/edit-specification/${row.getValue("id")}`}>
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
    },
  ];
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [specifications, setSpecifications] = useState([]);

  const fetchSpecifications = useCallback(async () => {
    try {
      const response = await axios.get("/specification/all");
      const data = response.data;
      setSpecifications(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchSpecifications();
    })();
  }, [fetchSpecifications]);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/specification", {
        data: { id },
      });
      setDeleteId("");
      await fetchSpecifications();
      toast.warning("Deleted", { description: "Specfication Deleted" });
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
      <div className="w-md">
        <DataTable
          columns={columns}
          data={specifications}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}

export default ManageSpecification;
