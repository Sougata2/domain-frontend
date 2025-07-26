import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import Select from "react-select";
import DataTable from "@/DomainComponents/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function MapActivityToSubSerivce() {
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
            Activity
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="lowercase ps-3">{row.getValue("name")}</div>;
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
              className={"border-black"}
              disabled={!selectedSubService}
              checked={mappedActivities[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedActivities((prevState) => {
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
  const [selectedSubService, setSelectedSubService] = useState(undefined);
  const [subServices, setSubServices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [mappedActivities, setMappedActivities] = useState({});
  const activityRef = useRef();

  const fetchSubServices = useCallback(async () => {
    try {
      const response = await axios.get("/sub-service/all");
      const data = response.data;
      setSubServices(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

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
      await fetchSubServices();
    })();
  }, [fetchSubServices]);

  useEffect(() => {
    (async () => {
      await fetchActivities();
    })();
  }, [fetchActivities]);

  useEffect(() => {
    if (selectedSubService) {
      selectedSubService.value?.activities.forEach((a) => {
        setMappedActivities((prevState) => {
          return {
            ...prevState,
            [a.id]: true,
          };
        });
      });
    } else {
      setMappedActivities({});
    }
  }, [selectedSubService]);

  async function handleSave() {
    try {
      const selectedActivities = Object.entries(mappedActivities)
        .filter(([, isIncluded]) => isIncluded)
        .map(([id]) => Number(id));

      const payload = {
        id: selectedSubService.value.id,
        activities: activities
          .filter((a) => selectedActivities.includes(a.id))
          .map((a) => ({ id: a.id })),
      };
      const response = await axios.put("/sub-service", payload);
      const _ = response.data;
      toast.success("Success", {
        description: "Activities mapped successfully",
      });
      setSelectedSubService(undefined);
      setMappedActivities({});
      activityRef.current.clearValue();
      await fetchSubServices();
      await fetchActivities();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-md flex flex-col gap-8">
        <div>
          <Label className={"pb-3"}>SubService</Label>
          <Select
            ref={activityRef}
            className="basic-single"
            classNamePrefix="select"
            placeholder={"Select SubService"}
            isClearable={true}
            isSearchable={true}
            name="subService"
            options={subServices}
            onChange={(e) =>
              setSelectedSubService((prevState) => {
                if (prevState !== null && prevState !== undefined)
                  if (prevState.label !== e?.label) setMappedActivities({});
                return e;
              })
            }
          />
        </div>
        <div>
          <Label className={""}>Activity</Label>
          <DataTable
            data={activities}
            columns={columns}
            options={{ searchField: "name" }}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!selectedSubService}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MapActivityToSubSerivce;
