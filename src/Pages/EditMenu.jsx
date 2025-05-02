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
    menuItemName: "",
    pageLink: "",
    isValid: "",
    logDate: "",
    menuItems: [],
    menuItem: "",
  };
  const { id } = useParams();
  const [formData, setFormData] = useState(initialValue);
  const [isSubMenu, setIsSubMenu] = useState(false);
  const [subMenus, setSubMenus] = useState([]);
  const [mappedSubMenus, setMappedSubMenus] = useState({});

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
            Sub Menu
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
          import.meta.env.VITE_SERVER_URL +"/menu-item/" + id
        );
        setFormData(response.data);
        if (response.data.pageLink === null || response.data.pageLink === "") {
          getAllAsSubMenus();
        } else {
          setIsSubMenu(true);
        }
      } catch (e) {
        toast.error("Error", { description: e.message });
      }
    })();
  }, [id]);

  useEffect(() => {
    if (subMenus.length > 0) {
      formData.menuItems.forEach((sm) => {
        setMappedSubMenus((prevState) => {
          return {
            ...prevState,
            [sm.id]: true,
          };
        });
      });
    }
  }, [formData.menuItems, subMenus]);

  async function getAllAsSubMenus() {
    try {
      const response = await axios.get(
        "http://localhost:8080/domain/menu-item/all"
      );
      setSubMenus(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const includeMenusOrSubMenus = subMenus.filter(
        (sm) => mappedSubMenus[sm.id]
      );
      const payload = { ...formData, menuItems: includeMenusOrSubMenus };
      const response = await axios.put(
        "http://localhost:8080/domain/menu-item",
        payload
      );
      setFormData(response.data);
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
          <Label htmlFor={"menuItemName"}>Menu</Label>
          <Input
            name="menuItemName"
            placeholder={"Menu Item Name"}
            value={formData.menuItemName}
            id={"menuItemName"}
            onChange={onChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSubItem"
            checked={isSubMenu}
            onCheckedChange={() => {
              setIsSubMenu((prevState) => !prevState);
              formData.pageLink = "";
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
            <Label htmlFor={"pageLink"}>Page Link</Label>
            <Input
              name={"pageLink"}
              placeholder={`Page Link`}
              value={formData.pageLink === null ? "" : formData.pageLink}
              id={"pageLink"}
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
            options={{ searchField: "menuItemName" }}
          />
        )}
      </div>
    </div>
  );
}
