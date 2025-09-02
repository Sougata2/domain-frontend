import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { LuTrash } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router";

import axios from "axios";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import DataTable from "@/DomainComponents/DataTable";
import { Badge } from "@/components/ui/badge";

function ManageMandatoryDocument() {
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
            Mandatory Document
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "subService",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sub Service
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        if (!row.getValue("subService")) return null;
        return (
          <div className="ps-3 flex gap-1 flex-wrap">
            <Badge variant="secondary">
              {row.getValue("subService")?.name}
            </Badge>
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
                  <Link to={`/edit-mandatory-document/${row.getValue("id")}`}>
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
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const fetchMandatoryDocuments = useCallback(async () => {
    try {
      const response = await axios.get("/mandatory-document/all");
      const data = response.data;
      setMandatoryDocuments(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchMandatoryDocuments();
    })();
  }, [fetchMandatoryDocuments]);

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/mandatory-document", {
        data: { id },
      });
      setDeleteId("");
      await fetchMandatoryDocuments();
      toast.warning("Deleted", { description: "Mandatory Document Deleted" });
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
          data={mandatoryDocuments}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}

export default ManageMandatoryDocument;
