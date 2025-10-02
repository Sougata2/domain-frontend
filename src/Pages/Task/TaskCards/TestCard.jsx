import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { GrDocumentTest } from "react-icons/gr";
import { ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";

function TestCard({ jobId }) {
  const navigate = useNavigate();
  const { id: assignerId } = useSelector((state) => state.user);
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
      accessorKey: "recordCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Test Record Count
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("recordCount")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        return (
          <Link to={`/lab-test-entry/${jobId}/${row.getValue("id")}`}>
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

  const fetchRecordCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `/lab-test-record/get-record-count/${jobId}`
      );
      const data = response.data;
      setTemplates((prevState) => {
        return prevState.map((t) => ({
          ...t,
          recordCount: Number(data[t.id] ?? 0),
        }));
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [jobId]);

  useEffect(() => {
    (async () => {
      await fetchTemplates();
      await fetchRecordCount();
    })();
  }, [fetchRecordCount, fetchTemplates]);

  async function handleSubmitReport() {
    try {
      const response = await axios.get(`/workflow-action/by-job-id/${jobId}`);
      const data = response.data;

      const payload = {
        job: { id: jobId },
        workFlowAction: { id: data[0].id },
        assigner: { id: assignerId },
      };

      await axios.post("/job/do-next", payload);
      toast.success("Success", { description: "Test Report Submitted" });
      navigate("/job-list");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="text-xl font-bold">Test Report</div>
        <Button onClick={handleSubmitReport}>Submit Report</Button>
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
