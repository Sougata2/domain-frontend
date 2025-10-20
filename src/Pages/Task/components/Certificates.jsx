import { useCallback, useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import DataTable from "@/DomainComponents/DataTable";
import Download from "@/DomainComponents/Download";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Certificates({ referenceNumber }) {
  const columns = [
    {
      accessorKey: "certificateNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Certificate Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("certificateNumber")}</div>;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Certificate
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "file",
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3">
            <div>
              <Download fileId={row.getValue("file")?.id} />
            </div>
          </div>
        );
      },
    },
  ];
  const [certificates, setCertificates] = useState([]);

  const fetchCertificates = useCallback(async () => {
    try {
      const response = await axios.get(
        `certificate/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setCertificates(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchCertificates();
    })();
  }, [fetchCertificates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificates</CardTitle>
        <CardDescription>
          list of all certificates issued by certification body
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <DataTable
            columns={columns}
            data={certificates}
            options={{ searchField: "certificateNumber" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default Certificates;
