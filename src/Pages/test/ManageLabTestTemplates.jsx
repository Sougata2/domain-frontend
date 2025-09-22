import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import { AlertButton } from "@/DomainComponents/AlertBox";
import { Ellipsis } from "lucide-react";
import { LuTrash } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router";

import TanstackTable from "@/components/TanstackTable";
import axios from "axios";

function ManageLabTestTemplates() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <div>Table Name</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "subServices",
        header: () => <div>Sub Services</div>,
        cell: (row) => (
          <div className="flex gap-2">
            {row.getValue().map((d) => (
              <Badge key={d.id}>{d.name}</Badge>
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
                    <Link to={`/edit-lab-test-template/${row.getValue("id")}`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LuTrash />
                    <AlertButton
                      onConfirm={() => handleDelete(row.getValue("id"))}
                    >
                      Delete
                    </AlertButton>
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

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/lab-test-template", {
        data: { id },
      });
      setRefreshKey((prev) => prev + 1);
      toast.warning("Deleted", { description: "Lab Test Template Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <TanstackTable
        columns={columns}
        postURL={"/lab-test-template/search"}
        refreshKey={refreshKey}
      />
    </div>
  );
}

export default ManageLabTestTemplates;
