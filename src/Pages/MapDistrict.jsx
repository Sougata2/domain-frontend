import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

function MapDistrict() {
  const initialValues = {
    district: {},
    cities: [],
  };
  const columns = [
    {
      accessorKey: "cityName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            City
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("cityName")}</div>
      ),
    },
    {
      accessorKey: "id",
      header: () => <div>Actions</div>,
      cell: ({ row }) => {
        return (
          <div>
            {/* <input type="checkbox" name="" id="" onChange={() => {}} /> */}
            <Checkbox
              checked={mappedCities[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedCities((prevState) => {
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
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState(initialValues);
  const [mappedCities, setMappedCities] = useState({});

  async function fetchDistricts() {
    try {
      const response = await axios.get("http://localhost:8080/domain/district");
      setDistricts(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (Object.keys(formData.district).includes("id")) {
      (async () => {
        try {
          const response = await axios.get("http://localhost:8080/domain/city");
          formData.district.cities.forEach((c) => {
            setMappedCities((prevState) => {
              return {
                ...prevState,
                [c.id]: true,
              };
            });
          });
          setCities(response.data);
        } catch (error) {
          toast.error("Error", { description: error.message });
        }
      })();
    }
  }, [formData.district]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      // get the district;
      const includedCities = cities.filter((c) => mappedCities[c.id]);
      const payload = {
        ...formData.district,
        cities: includedCities,
      };
      const response = await axios.post(
        "http://localhost:8080/domain/district/update",
        payload
      );
      setFormData((prevState) => {
        return {
          ...prevState,
          district: response.data,
        };
      });
      toast.success("Success", { description: "update successfull!" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"p-5 flex flex-col items-center justify-center"}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3.5 items-center justify-center"
      >
        <select
          className={"w-md py-1 px-1 border rounded"}
          name={"district"}
          onChange={(e) => {
            setFormData((prevState) => {
              return {
                ...prevState,
                district: JSON.parse(e.target.value),
              };
            });
            // clearing the previous mapped cities.
            setMappedCities({});
          }}
        >
          <option value="" className={"text-sm text-slate-500"}>
            Select Districts
          </option>
          {districts.map((d) => {
            return (
              <option
                value={JSON.stringify(d)}
                key={d.id}
                className={"text-left"}
              >
                {d.distName}
              </option>
            );
          })}
        </select>

        {formData.district?.id && (
          <div className="w-4xl mt-3.5">
            <DataTable
              data={cities}
              columns={columns}
              options={{ searchField: "cityName" }}
            />
          </div>
        )}
        {formData.district?.id && (
          <div className="flex justify-end w-full mt-4">
            <Button className={"w-2xs"}>Save</Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default MapDistrict;
