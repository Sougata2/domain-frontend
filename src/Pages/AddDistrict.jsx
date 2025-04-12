import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.jsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { DomainAlert } from "@/DomainComponents/DomainAlert.jsx";
import axios from "axios";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";

function AddDistrict() {
  const initialValues = {
    distName: "",
  };
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
      accessorKey: "actions",
      header: () => {
        return <div>Actions</div>;
      },
      cell: () => {
        return (
          <div className={"flex gap-3.5"}>
            <Button
              className={"bg-emerald-400 hover:bg-emerald-500 text-emerald-700"}
            >
              Edit
            </Button>
            <Button className={"bg-red-400 hover:bg-red-500 text-red-700"}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const [formData, setFormData] = useState(initialValues);
  const [alert, setAlert] = useState(initialErrorValues);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:8080/domain/district");
      setDistricts(response.data);
    })();
  }, []);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/domain/district",
        formData
      );
      setDistricts((prevState) => [...prevState, response.data]);
      setAlert({ type: "success", message: "District Add Successfully" });
      setFormData(initialValues);
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  }

  return (
    <div className={"container w-1/3 mx-auto"}>
      <div className="me-auto">{alert.type && <DomainAlert {...alert} />}</div>
      <form className={"flex flex-col gap-2"} onSubmit={handleOnSubmit}>
        <div className={"form-group"}>
          <Label htmlFor={"distName"}>District Name</Label>
          <Input
            type={"text"}
            name={"distName"}
            value={formData.distName}
            onChange={handleOnChange}
          />
        </div>
        <div className={"form-group"}>
          <Button className={""}>Submit</Button>
        </div>
      </form>
      <DataTable
        data={districts}
        columns={columns}
        options={{ searchField: "distName" }}
      />
    </div>
  );
}

export default AddDistrict;
