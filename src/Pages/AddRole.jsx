import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router";
import DataTable from "@/DomainComponents/DataTable.jsx";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";

function AddRole() {
  const initialValues = {
    name: "",
  };
  const [formData, setFormData] = useState(initialValues);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
            Role Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div>Actions</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            {/* <Button
              onClick={() => navigate(`/edit-role/${row.getValue("id")}`)}
              className={
                "bg-emerald-400 hover:bg-emerald-500 text-emerald-700 hover:text-emerald-800"
              }
            >
              Edit
            </Button> */}
            <Button
              onClick={() => {
                setOpenAlert(true);
                setDeleteId(row.getValue("id"));
              }}
              className={
                "bg-red-400 hover:bg-red-500 text-red-700 hover:text-red-800"
              }
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get("/role");
      const data = response.data;
      setRoles(data);
    } catch (e) {
      toast.error("Error", { description: e.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchRoles();
    })();
  }, [fetchRoles]);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`/role`, {
        ...formData,
        name: formatname(formData.name),
      });
      const data = response.data;
      setFormData(initialValues);
      toast.success("Success", {
        description: `Role ${data.name} Added Successfully`,
      });
      await fetchRoles();
    } catch (e) {
      toast.error("Error", { description: e.message });
    }
  }

  function formatname(name) {
    return name.trim().split(/\s+/).join("_");
  }

  async function handleDelete(id) {
    try {
      const response = await axios.delete("/role", { data: { id } });
      const data = response.data;
      toast.warning("Delete", { description: `Role ${data.name} deleted` });
      await fetchRoles();
      setDeleteId(null);
      setOpenAlert(false);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex flex-col gap-4 justify-center items-center py-12"}>
      <ConfirmationAlert
        closeHandler={() => {
          setOpenAlert(false);
          setDeleteId(null);
        }}
        isOpen={openAlert}
        handleConfirm={() => handleDelete(deleteId)}
      />
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"name"}>Role Name</Label>
          <Input
            name="name"
            placeholder={"Role Name"}
            value={formData.name}
            id={"name"}
            onChange={onChange}
          />
        </div>

        <Button>Add Role</Button>
      </form>

      <div className="w-xl">
        <DataTable
          data={roles}
          columns={columns}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}

export default AddRole;
