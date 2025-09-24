import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import DataTable from "@/DomainComponents/DataTable";
import Select from "react-select";
import axios from "axios";

function MapTestTemplateToSubService() {
  const subServiceOptionRef = useRef(null);
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
            Templates
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="lowercase">{row.getValue("name")}</div>;
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
              checked={mappedTemplates[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedTemplates((prevState) => {
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

  const [subServiceOptions, setSubServiceOptions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState(null);
  const [mappedTemplates, setMappedTemplates] = useState({});

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await axios.get("/lab-test-template/all");
      const data = response.data;
      setTemplates(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchSubServices = useCallback(async () => {
    try {
      const response = await axios.get("/sub-service/all");
      const data = response.data;
      setSubServiceOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchSubServices();
      await fetchTemplates();
    })();
  }, [fetchSubServices, fetchTemplates]);

  useEffect(() => {
    if (selectedSubService) {
      selectedSubService?.value.testTemplates.forEach((m) => {
        setMappedTemplates((prevState) => {
          return {
            ...prevState,
            [m.id]: true,
          };
        });
      });
    } else {
      setMappedTemplates({});
    }
  }, [selectedSubService]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const selectedTemplates = Object.entries(mappedTemplates)
        .filter(([, isIncluded]) => isIncluded)
        .map(([id]) => Number(id));

      const payload = {
        id: selectedSubService?.value.id,
        testTemplates: templates
          .filter((m) => selectedTemplates.includes(m.id))
          .map((m) => ({ id: m.id })),
      };

      const response = await axios.put("/sub-service", payload);

      const _ = response.data;

      setSelectedSubService(undefined);
      setMappedTemplates({});
      subServiceOptionRef.current.clearValue();
      await fetchSubServices();
      await fetchTemplates();
      toast.success("Success", {
        description: "Mapped Templates to Sub Service",
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }
  return (
    <div className={"flex justify-center items-center"}>
      <form className={"flex flex-col"} onSubmit={handleSubmit}>
        <div className={"flex justify-center"}>
          <Select
            ref={subServiceOptionRef}
            className={"w-md"}
            placeholder={"Select Sub Service"}
            isClearable
            isSearchable
            options={subServiceOptions}
            onChange={(e) =>
              setSelectedSubService((prevState) => {
                if (prevState !== null && prevState !== undefined)
                  if (prevState.label !== e?.label) setMappedTemplates({});
                return e;
              })
            }
          />
        </div>
        <div className={"mt-5 w-3xl"}>
          <DataTable
            data={templates}
            columns={columns}
            options={{ searchField: "name" }}
          />
        </div>
        <Button disabled={!selectedSubService}>Save</Button>
      </form>
    </div>
  );
}

export default MapTestTemplateToSubService;
