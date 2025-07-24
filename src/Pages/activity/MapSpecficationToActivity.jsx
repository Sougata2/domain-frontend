import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

function MapSpecficationToActivity() {
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
      accessorKey: "id",
      header: () => {
        return <div>Include</div>;
      },
      cell: ({ row }) => {
        return (
          <div>
            <Checkbox
              checked={mappedSpecifications[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedSpecifications((prevState) => {
                  return {
                    ...prevState,
                    [row.getValue("id")]: e,
                  };
                });
              }}
            />
          </div>
        );
      },
    },
  ];
  const { id: activityId } = useParams();

  const [activity, setActivity] = useState({});
  const [specifications, setSpecifications] = useState([]);
  const [mappedSpecifications, setMappedSpecifications] = useState({});

  const fetchActivity = useCallback(async () => {
    try {
      const response = await axios.get(`/activity/${activityId}`);
      const data = response.data;
      setActivity(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [activityId]);

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
      await fetchActivity();
    })();
  }, [fetchActivity]);

  useEffect(() => {
    (async () => {
      await fetchSpecifications();
    })();
  }, [fetchSpecifications]);

  useEffect(() => {
    if (activity?.specifications?.length > 0 && specifications.length > 0) {
      activity.specifications.forEach((s) => {
        setMappedSpecifications((prevState) => {
          return {
            ...prevState,
            [s.id]: true,
          };
        });
      });
    }
  }, [activity, specifications]);

  async function handleSave() {
    try {
      const includedSpecifications = Object.entries(mappedSpecifications)
        .filter(([, isIncluded]) => isIncluded)
        .map(([id]) => id);

      const payload = {
        id: activity.id,
        specifications: includedSpecifications.map((ms) => ({
          id: Number(ms),
        })),
      };
      const _ = await axios.put("/activity", payload);
      toast.success("Success", {
        description: "Specifications Mapped To Activity",
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <div className={"flex flex-col gap-2.5"}>
        <div className={"w-2xl"}>
          <DataTable
            data={specifications}
            columns={columns}
            options={{ searchField: "name" }}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default MapSpecficationToActivity;
