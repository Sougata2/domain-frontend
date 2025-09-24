import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router";

import DataTable from "@/DomainComponents/DataTable";
import { GrDocumentTest } from "react-icons/gr";
import axios from "axios";

function TestCard({ jobId }) {
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
            Test Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        return (
          <Link to={`/lab-test-entry/${row.getValue("id")}`}>
            <GrDocumentTest size={17} />
          </Link>
        );
      },
    },
  ];
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await axios.get(`/lab-test-template/by-job-id/${jobId}`);
      const data = response.data;
      setTemplates(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [jobId]);

  useEffect(() => {
    (async () => {
      await fetchTemplates();
    })();
  }, [fetchTemplates]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="text-xl font-bold">Test Report</div>
        <Button>Submit Report</Button>
      </div>
      <div className="w-full">
        <DataTable
          columns={columns}
          data={templates}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}

export default TestCard;
