import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

function MapDistrict() {
  const columns = [
    {
      accessorKey: "distName",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              District
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className={"capitalize"}>{row.getValue("distName")}</div>;
      },
    },
    {
      accessorKey: "cities",
      header: () => {
        return <div>Cities</div>;
      },
      cell: ({ row }) => {
        return (
          <div>
            {row
              .getValue("cities")
              .map((c) => c.cityName)
              .join(", ")}
          </div>
        );
      },
    },
  ];

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/domain/district/mapped"
        );
        setTableData(response.data);
      } catch (e) {
        toast.error("Error", e.message);
      }
    })();
  }, [selectedDistrict?.id]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/domain/district"
        );
        const data = response.data.map((d) => {
          return {
            label: d.distName,
            value: d,
          };
        });
        setDistricts(data);
      } catch (e) {
        toast.error("Error", e.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedDistrict.id) {
      (async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/domain/city/not-mapped-to-dist?dist=${selectedDistrict.id}`
          );
          const options = response.data.map((c) => {
            return { label: c.cityName, value: c };
          });
          setCities(options);
        } catch (e) {
          toast.error("Error", e.message);
        }
      })();
    }
  }, [selectedDistrict.id]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...selectedDistrict,
        cities: selectedCities.map((sc) => sc.value),
      };
      await axios.post("http://localhost:8080/domain/district/map", payload);
      setSelectedCities([]);
      setSelectedDistrict({});
      toast.success("Success", { description: "Mapped Successfully" });
    } catch (e) {
      toast.error("Error", e.message);
    }
  }

  return (
    <div className={"p-5 flex flex-col items-center justify-center"}>
      <form onSubmit={onSubmit} className={"flex flex-col gap-2.5"}>
        <div className={"d-flex flex-column gap-3.5 w-[380px]"}>
          <Label>District</Label>
          <Select
            options={districts}
            onChange={(so) => setSelectedDistrict(so.value)}
          />
        </div>

        <div className={"mt-4"}>
          <Select
            closeMenuOnSelect={false}
            value={selectedCities}
            onChange={(selectedOption) => setSelectedCities(selectedOption)}
            isMulti
            options={cities}
            isDisabled={selectedDistrict.id == null}
          />
        </div>
        <Button>Submit</Button>
      </form>

      <div className={"mt-5 w-full px-28"}>
        <h1>Mapped Districts</h1>
        <DataTable
          data={tableData}
          columns={columns}
          options={{ searchField: "distName" }}
        />
      </div>
    </div>
  );
}

export default MapDistrict;
