import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable from "@/DomainComponents/DataTable";
import useMenu from "@/hooks/use-menu";
import axios from "axios";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { IoSettingsOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";

export default function AddMenu() {
  const initialValue = {
    name: "",
    url: "",
  };

  const initialError = {
    menuItemName: "",
    pageLink: "",
  };

  const columns = [
    {
      accessorKey: "name",
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
        return <div className="capitalize">{row.getValue("name")}</div>;
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
        return <div>Page Link</div>;
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
        return <div className="text-center">Actions</div>;
      },
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {row.getValue("url") === "" && (
                  <DropdownMenuItem>
                    <IoSettingsOutline />
                    <Link to={`/manage-menu/${row.getValue("id")}`}>
                      Manage
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <CiEdit />
                  <Link to={`/edit-menu/${row.getValue("id")}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LuTrash />
                  <button
                    onClick={() => {
                      setOpenAlert(true);
                      setDeleteId(row.getValue("id"));
                    }}
                  >
                    Delete
                  </button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [formData, setFormData] = useState(initialValue);
  const [formError, setFormError] = useState(initialError);
  const [isSubItem, setIsSubItem] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(undefined);

  const { data: menus, refreshHandler: refreshMenu } = useMenu(0);

  function validate() {
    if (isSubItem && formData.url === "") {
      setFormError((prevState) => {
        return {
          ...prevState,
          url: "Field cannot be empty",
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
        await axios.post("/menu", formData);
        setFormData(initialValue);
        toast.success("Success", { description: "Menu Item Added!" });
        // for syncing data
        await refreshMenu();
      }
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleDelete(id) {
    try {
      const response = await axios.delete("/menu", {
        data: { id },
      });
      const _ = response.data;
      toast.warning("Deleted", { description: "Menu deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="container">
      <ConfirmationAlert
        isOpen={openAlert}
        closeHandler={() => setOpenAlert(false)}
        handleConfirm={() => {
          handleDelete(deleteId);
          setOpenAlert(false);
        }}
      />
      <form className="w-md mx-auto flex flex-col gap-3" onSubmit={onSubmit}>
        <div className={"form-group flex flex-col gap-2"}>
          <Label htmlFor={"name"}>Menu Item Name</Label>
          <Input
            type={"text"}
            name={"name"}
            value={formData.name}
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
            <Label htmlFor={"url"}>Url</Label>
            <Input
              type={"text"}
              name={"url"}
              value={formData.url}
              onChange={handleOnChange}
            />
            {formError.url && (
              <span className="text-sm text-red-400">{formError.url}</span>
            )}
          </div>
        )}
        <div className={"form-group"}>
          <Button>Add Menu</Button>
        </div>
      </form>
      <div className={"mt-5 w-3xl mx-auto"}>
        <DataTable
          data={menus}
          columns={columns}
          options={{ searchField: "name" }}
        />
      </div>
    </div>
  );
}
