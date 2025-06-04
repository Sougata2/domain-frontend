import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";

export default function EditMenu() {
  const initialValue = {
    id: "",
    name: "",
    url: "",
    subMenus: null,
    menu: null,
  };
  const { id } = useParams();
  const [formData, setFormData] = useState(initialValue);
  const [isSubMenu, setIsSubMenu] = useState(false);
  const [subMenus, setSubMenus] = useState([]);
  const [mappedSubMenus, setMappedSubMenus] = useState({});

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
            Sub Menu
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="lowercase">{row.getValue("name")}</div>;
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
            {row.getValue("url") === null || row.getValue("url") === "" ? (
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
      accessorKey: "url",
      header: () => {
        return <div>Url</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="text-blue-400 text-[17px]">
            {row.getValue("url") && "/"}
            {row.getValue("url")}
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
              disabled={row.getValue("id") === id}
              checked={mappedSubMenus[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedSubMenus((prevState) => {
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
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_URL + "/menu/" + id
        );
        setFormData(response.data);
        if (response.data.url === null || response.data.url === "") {
          getAllAsSubMenus();
        } else {
          setIsSubMenu(true);
        }
      } catch (e) {
        toast.error("Error", { description: e.message });
      }
    })();
  }, [id]);

  console.log(formData);

  useEffect(() => {
    if (subMenus.length > 0) {
      formData.subMenus.forEach((sm) => {
        setMappedSubMenus((prevState) => {
          return {
            ...prevState,
            [sm.id]: true,
          };
        });
      });
    }
  }, [formData.subMenus, subMenus]);

  console.log(mappedSubMenus);

  async function getAllAsSubMenus() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/menu"
      );
      setSubMenus(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const includeMenusOrSubMenus = subMenus
        .filter((sm) => mappedSubMenus[sm.id])
        .map((fsm) => ({ id: fsm.id }));
      console.log(includeMenusOrSubMenus);

      // const payload = { ...formData, menuItems: includeMenusOrSubMenus };
      // const response = await axios.put(
      //   import.meta.env.VITE_SERVER_URL + "menu",
      //   payload
      // );
      // setFormData(response.data);
      toast.success("Success", { description: "Menu Updated" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  return (
    <div className={"flex flex-col gap-4 justify-center items-center py-12"}>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"name"}>Menu</Label>
          <Input
            name="name"
            placeholder={"Menu Name"}
            value={formData.name}
            id={"name"}
            onChange={onChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSubItem"
            checked={isSubMenu}
            onCheckedChange={() => {
              setIsSubMenu((prevState) => !prevState);
              formData.url = "";
            }}
          />
          <label
            htmlFor="isSubItem"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sub Menu
          </label>
        </div>

        {isSubMenu && (
          <div className={"flex flex-col gap-2.5"}>
            <Label htmlFor={"url"}>Page Link</Label>
            <Input
              name={"url"}
              placeholder={`Url`}
              value={formData.url === null ? "" : formData.url}
              id={"url"}
              onChange={onChange}
            />
          </div>
        )}
        <Button>Save Changes</Button>
      </form>

      <div className="w-2xl">
        {!isSubMenu && (
          <DataTable
            data={subMenus}
            columns={columns}
            options={{ searchField: "name" }}
          />
        )}
      </div>
    </div>
  );
}
