import { useEffect, useState } from "react";
import { DomainAlert } from "@/DomainComponents/DomainAlert.jsx";
import axios from "axios";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";

function MapDistrict() {
  const initialErrorValues = {
    type: "",
    message: "",
  };
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
  const [alert, setAlert] = useState(initialErrorValues);
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
        setAlert({ type: "error", message: e.message });
      }
    })();
  }, []);

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
      } catch (error) {
        setAlert({ type: "error", message: error.message });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:8080/domain/city");
        const options = response.data.map((c) => {
          return { label: c.cityName, value: c };
        });
        setCities(options);
      } catch (e) {
        setAlert({ type: "error", message: e.message });
      }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...selectedDistrict,
        cities: selectedCities.map((sc) => sc.value),
      };
      const response = await axios.post(
        "http://localhost:8080/domain/district/map",
        payload
      );
      console.log(response);
    } catch (e) {
      setAlert({ type: "error", message: e.message });
    }
  }

  return (
    <div className={"p-5 flex flex-col items-center justify-center"}>
      <div>
        {
          <div className="me-auto">
            {alert.type && <DomainAlert {...alert} />}
          </div>
        }
      </div>
      <form onSubmit={onSubmit} className={"flex flex-col gap-2.5"}>
        <div className={"d-flex flex-column gap-3.5 w-[380px]"}>
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
