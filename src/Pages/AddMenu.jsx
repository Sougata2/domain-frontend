import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddMenu() {
  const initialValue = {
    menuItemName: "",
    pageLink: null,
  };

  const initialError = {
    menuItemName: "",
    pageLink: "",
  };

  const columns = [
    {
      accessorKey: "menuItemName",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Menu
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("menuItemName")}</div>;
      },
    },
    {
      accessorKey: "pageLink",
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Type
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("pageLink") === null ? (
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
      accessorKey: "actions",
      header: () => {
        return <div className="text-center">Actions</div>;
      },
      cell: () => {
        return (
          <div className={"flex justify-center gap-3.5"}>
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

  const [formData, setFormData] = useState(initialValue);
  const [formError, setFormError] = useState(initialError);
  const [isSubItem, setIsSubItem] = useState(false);

  const [menus, setMenus] = useState([]);

  useEffect(() => {
    getAllActiveMenuItemOrSubMenuItem();
  }, []);

  async function getAllActiveMenuItemOrSubMenuItem() {
    try {
      const response = await axios.get(
        "http://localhost:8080/domain/menu-item/all"
      );
      setMenus(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  function validate() {
    if (isSubItem && formData.pageLink === "") {
      setFormError((prevState) => {
        return {
          ...prevState,
          pageLink: "Field cannot be empty",
        };
      });
      return false;
    }
    return true;
  }

  function handleOnChange(e) {
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
      if (validate()) {
        await axios.post("http://localhost:8080/domain/menu-item", formData);
        setFormData(initialValue);
        toast.success("Success", { description: "Menu Item Added!" });
        // for syncing data
        getAllActiveMenuItemOrSubMenuItem();
      }
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }
  return (
    <div className="container">
      <form className="w-md mx-auto flex flex-col gap-3" onSubmit={onSubmit}>
        <div className={"form-group flex flex-col gap-2"}>
          <Label htmlFor={"menuItemName"}>Menu Item Name</Label>
          <Input
            type={"text"}
            name={"menuItemName"}
            value={formData.menuItemName}
            onChange={handleOnChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSubItem"
            checked={isSubItem}
            onCheckedChange={() => setIsSubItem((prevState) => !prevState)}
          />
          <label
            htmlFor="isSubItem"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sub Menu Items
          </label>
        </div>

        {isSubItem && (
          <div className="flex flex-col gap-2">
            <Label htmlFor={"pageLink"}>Page Link</Label>
            <Input
              type={"text"}
              name={"pageLink"}
              value={formData.pageLink}
              onChange={handleOnChange}
            />
            {formError.pageLink && (
              <span className="text-sm text-red-400">{formError.pageLink}</span>
            )}
          </div>
        )}
        <div className={"form-group"}>
          <Button>Submit</Button>
        </div>
      </form>
      <div className={"mt-5 w-3xl mx-auto"}>
        <DataTable
          data={menus}
          columns={columns}
          options={{ searchField: "menuItemName" }}
        />
      </div>
    </div>
  );
}
