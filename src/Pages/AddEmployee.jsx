import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AddEmployee() {
  const navigate = useNavigate();
  const intitialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    roles: [],
  };
  const columns = [
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("firstName")}</div>;
      },
    },
    {
      accessorKey: "middleName",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Middle Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("middleName")}</div>;
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("lastName")}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("email")}</div>;
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
            <Button
              onClick={() => navigate(`/edit-employee/${row.getValue("id")}`)}
              className={
                "bg-emerald-400 hover:bg-emerald-500 text-emerald-700 hover:text-emerald-800"
              }
            >
              Edit
            </Button>
            <Button
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

  const [formData, setFormData] = useState(intitialValues);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/employee"
      );
      setEmployees(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchEmployees();
    })();
  }, [fetchEmployees]);

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
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/employee",
        formData
      );
      const data = response.data;
      setFormData(intitialValues);
      toast.success("Success", { description: "Employee Added" });
      await fetchEmployees();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }
  return (
    <div className={"flex flex-col gap-4 justify-center items-center py-12"}>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"firstName"}>First Name</Label>
          <Input
            name="firstName"
            placeholder={"First Name"}
            value={formData.firstName}
            id={"firstName"}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"middleName"}>Middle Name</Label>
          <Input
            name="middleName"
            placeholder={"Middle Name"}
            value={formData.middleName}
            id={"middleName"}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"lastName"}>Last Name</Label>
          <Input
            name="lastName"
            placeholder={"Last Name"}
            value={formData.lastName}
            id={"lastName"}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"email"}>Email</Label>
          <Input
            name="email"
            placeholder={"Email"}
            value={formData.email}
            id={"email"}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"password"}>Password</Label>
          <Input
            name="password"
            placeholder={"Password"}
            value={formData.password}
            id={"password"}
            type={"password"}
            onChange={onChange}
          />
        </div>
        <Button>Add Employee</Button>
      </form>

      <div className="">
        <DataTable
          data={employees}
          columns={columns}
          options={{ searchField: "email" }}
        />
      </div>
    </div>
  );
}
