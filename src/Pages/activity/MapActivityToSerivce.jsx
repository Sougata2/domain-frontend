import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import Select from "react-select";
import DataTable from "@/DomainComponents/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function MapActivityToSerivce() {
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
              disabled={!selectedService}
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
  const [selectedService, setSelectedService] = useState(undefined);
  const [services, setServices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [mappedActivities, setMappedActivities] = useState({});
  const activityRef = useRef();

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("/service/all");
      const data = response.data;
      setServices(data.map((d) => ({ label: d.name, value: d })));
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
      await fetchServices();
    })();
  }, [fetchServices]);

  useEffect(() => {
    (async () => {
      await fetchActivities();
    })();
  }, [fetchActivities]);

  useEffect(() => {
    if (selectedService) {
      selectedService.value?.activities.forEach((a) => {
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
  }, [selectedService]);

  async function handleSave() {
    try {
      const selectedActivities = Object.entries(mappedActivities)
        .filter(([, isIncluded]) => isIncluded)
        .map(([id]) => Number(id));

      const payload = {
        id: selectedService.value.id,
        activities: activities
          .filter((a) => selectedActivities.includes(a.id))
          .map((a) => ({ id: a.id })),
      };
      const response = await axios.put("/service", payload);
      const _ = response.data;
      toast.success("Success", {
        description: "Activities mapped successfully",
      });
      setSelectedService(undefined);
      setMappedActivities({});
      activityRef.current.clearValue();
      await fetchServices();
      await fetchActivities();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-md flex flex-col gap-8">
        <div>
          <Label className={"pb-3"}>Service</Label>
          <Select
            ref={activityRef}
            className="basic-single"
            classNamePrefix="select"
            placeholder={"Select Service"}
            isClearable={true}
            isSearchable={true}
            name="service"
            options={services}
            onChange={(e) =>
              setSelectedService((prevState) => {
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
          <Button onClick={handleSave} disabled={!selectedService}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MapActivityToSerivce;
