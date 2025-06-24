import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import axios from "axios";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function MapSubServiceToService() {
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
            Sub Services
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
              disabled={row.getValue("id") === serviceId}
              checked={mappedSubServices[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedSubServices((prevState) => {
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
  const { id: serviceId } = useParams();
  const [mappedSubServices, setMappedSubServices] = useState({});
  const [subServices, setSubServices] = useState([]);
  const [service, setService] = useState({});

  const fetchSubServices = useCallback(async () => {
    try {
      const response = await axios.get("/sub-service/all");
      const data = response.data;
      setSubServices(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchServiceById = useCallback(async () => {
    try {
      const response = await axios.get(`/service/${serviceId}`);
      const data = response.data;
      setService(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [serviceId]);

  useEffect(() => {
    (async () => {
      await fetchSubServices();
      await fetchServiceById();
    })();
  }, [fetchServiceById, fetchSubServices, serviceId]);

  useEffect(() => {
    if (service?.subServices?.length > 0) {
      service?.subServices?.forEach((ss) => {
        setMappedSubServices((prevState) => {
          return {
            ...prevState,
            [ss.id]: true,
          };
        });
      });
    }
  }, [service?.subServices]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const includedSubService = Object.keys(mappedSubServices)
        .filter((ssId) => mappedSubServices[ssId])
        .map((ssId) => ({ id: Number(ssId) }));

      const { createdAt, ...payload } = {
        ...service,
        subServices: includedSubService,
      };

      const _ = await axios.put("/service", payload);
      toast.success("Success", { description: "Service Updated Successfully" });
    } catch (error) {
      toast.error("Error", error.message);
    }
  }

  return (
    <div className={"flex flex-col justify-center items-center"}>
      <div className={"w-3xl"}>
        <DataTable
          data={subServices}
          columns={columns}
          options={{ searchField: "name" }}
        />
      </div>
      <form onSubmit={handleSubmit} className={"w-md"}>
        <Button className={"w-full"}>Save Changes</Button>
      </form>
    </div>
  );
}
