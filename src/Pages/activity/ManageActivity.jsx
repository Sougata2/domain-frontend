import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { toast } from "sonner";

function ManageActivity() {
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
            Activity Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "services",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3 flex gap-1 flex-wrap">
            {row.getValue("services").map((s) => (
              <Badge variant="secondary">{s.name}</Badge>
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
                  <IoSettingsOutline />
                  <Link to={`/map-activity/${row.getValue("id")}`}>Manage</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CiEdit />
                  <Link to={`/edit-activity/${row.getValue("id")}`}>Edit</Link>
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
  const [activities, setActivities] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axios.get("/activity/all");
      const data = response.data;
      setActivities(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchActivities();
    })();
  }, [fetchActivities]);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/activity", {
        data: { id },
      });
      setDeleteId("");
      await fetchActivities();
      toast.warning("Deleted", { description: "Activity Deleted" });
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
          data={activities}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}

export default ManageActivity;
