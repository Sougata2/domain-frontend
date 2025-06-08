import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/DomainComponents/DataTable";
import { ArrowUpDown } from "lucide-react";

export default function ManageMenu() {
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

  const fetchMenuById = useCallback(async () => {
    try {
      const response = await axios.get("/menu/" + id);
      setFormData(response.data);
      if (response.data.url === null || response.data.url === "") {
        getAllAsSubMenus();
      } else {
        setIsSubMenu(true);
      }
    } catch (e) {
      toast.error("Error", { description: e.message });
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await fetchMenuById();
    })();
  }, [fetchMenuById]);

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

  async function getAllAsSubMenus() {
    try {
      const response = await axios.get("/menu");
      setSubMenus(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const includeMenusOrSubMenus = subMenus
        .filter((fsm) =>
          Object.keys(mappedSubMenus)
            .map((k) => Number(k))
            .includes(fsm.id)
        )
        .map((fsm) => ({
          ...fsm,
          subMenus: null,
          menu: mappedSubMenus[fsm.id] ? { id: formData.id } : {},
        }));

      await axios.put("/menu/bulk", includeMenusOrSubMenus);

      await fetchMenuById();

      toast.success("Success", { description: "Menu Updated" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex flex-col gap-4 justify-center items-center"}>
      <div className="w-2xl">
        {!isSubMenu && (
          <DataTable
            data={subMenus}
            columns={columns}
            options={{ searchField: "name" }}
          />
        )}
      </div>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <Button>Save Changes</Button>
      </form>
    </div>
  );
}
