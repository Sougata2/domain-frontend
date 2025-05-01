import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function EditEmployee() {
  const intitialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    roles: [],
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(intitialValues);
  const [mappedRoles, setMappedRoles] = useState({});
  const [roles, setRoles] = useState([]);

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
          <div>
            <Checkbox
              checked={mappedRoles[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedRoles((prevState) => {
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

  useEffect(() => {
    (async () => {
      await fetchRoles();
    })();
  });

  useEffect(() => {
    if (formData.roles.length > 0) {
      formData.roles.forEach((role) => {
        setMappedRoles((prevState) => {
          return {
            ...prevState,
            [role.id]: true,
          };
        });
      });
    }
  }, [formData.roles, formData.roles.length]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/role"
      );
      const data = response.data;
      setRoles(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  };

  const fetchEmployee = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/employee/${id}`
      );
      setFormData(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      (async () => {
        await fetchEmployee();
      })();
    } else {
      navigate("/add-employee");
    }
  }, [fetchEmployee, id, navigate]);

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
      const response = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/employee",
        formData
      );
      const data = response.data;
      await fetchEmployee();
      toast.success("Success", {
        description: "Employee " + data.email + " updated",
      });
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
        <Button>Update Employee</Button>
      </form>

      <div className="">
        {/* <DataTable
          data={employees}
          columns={columns}
          options={{ searchField: "email" }}
        /> */}
      </div>
    </div>
  );
}
