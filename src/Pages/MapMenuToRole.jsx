import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/DomainComponents/DataTable";
import useMenu from "@/hooks/use-menu";
import Select from "react-select";
import { ArrowUpDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

function MapMenuToRole() {
  const columns = [
    {
      accessorKey: "menuItemName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Menu
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="lowercase">{row.getValue("menuItemName")}</div>;
      },
    },
    {
      accessorKey: "type",
      header: () => {
        return <div>Type</div>;
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("pageLink") === null ||
            row.getValue("pageLink") === "" ? (
              <span className="border-1.2 rounded-4xl bg-indigo-500 text-white shadow px-2.5 pb-0.5">
                Menu
              </span>
            ) : (
              <span className="border-1.2 rounded-4xl bg-blue-400 text-white shadow px-2.5 pb-0.5">
                Sub Menu
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "pageLink",
      header: () => {
        return <div>Page Link</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="text-blue-400 text-[17px]">
            {row.getValue("pageLink") && "/"}
            {row.getValue("pageLink")}
          </div>
        );
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
              disabled={!selectedRole}
              checked={mappedMenus[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedMenus((prevState) => {
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
  const menus = useMenu();

  const roleOptionRef = useRef(null);

  const [roles, setRoles] = useState([]);
  const [mappedMenus, setMappedMenus] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(undefined);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/role"
      );
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

  useEffect(() => {
    if (roles) {
      setRoleOptions(roles.map((r) => ({ label: r.roleName, value: r })));
    }
  }, [roles]);

  useEffect(() => {
    if (selectedRole) {
      selectedRole?.menuItems.forEach((m) => {
        setMappedMenus((prevState) => {
          return {
            ...prevState,
            [m.id]: true,
          };
        });
      });
    } else {
      setMappedMenus({});
    }
  }, [selectedRole]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(Object.entries(mappedMenus));

    try {
      const selectedMenus = Object.entries(mappedMenus)
        .filter(([, isIncluded]) => isIncluded)
        .map(([id]) => Number(id));
      //   console.log(selectedMenus);

      const payload = {
        ...selectedRole,
        menuItems: menus.filter((m) => selectedMenus.includes(m.id)),
      };
      //   console.log("Payload", payload);

      const response = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/role",
        payload
      );

      const _ = response.data;

      setSelectedRole(undefined);
      setMappedMenus({});
      roleOptionRef.current.clearValue();
      await fetchRoles();
      toast.success("Success", { description: "Updated Access" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  console.log(selectedRole);

  return (
    <div className={"flex flex-col justify-center"}>
      <form className={"flex flex-col items-center"} onSubmit={handleSubmit}>
        <div className={"flex justify-center items-center"}>
          <Select
            ref={roleOptionRef}
            className={"w-md"}
            placeholder={"Select Role"}
            isClearable
            isSearchable
            options={roleOptions}
            onChange={(e) => setSelectedRole(e?.value)}
          />
        </div>
        <div className={"mt-5 w-3xl mx-auto"}>
          <DataTable
            data={menus}
            columns={columns}
            options={{ searchField: "menuItemName" }}
          />
        </div>
        <Button
          className={"w-3xl bg-blue-500 hover:bg-blue-600"}
          disabled={!selectedRole}
        >
          Save
        </Button>
      </form>
    </div>
  );
}

export default MapMenuToRole;
