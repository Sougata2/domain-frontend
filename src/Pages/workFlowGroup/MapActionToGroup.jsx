import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";

function MapActionToGroup() {
  const { id: groupId } = useParams();

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
            Action
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("status").name}</div>;
      },
    },
    {
      accessorKey: "targetStatus",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Target Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("targetStatus").name}</div>;
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Include
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            <Checkbox
              checked={mappedAction[row.getValue("id")]}
              onCheckedChange={(e) => {
                setMappedAction((prevState) => {
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

  const [group, setGroup] = useState({});
  const [actions, setActions] = useState([]);
  const [mappedAction, setMappedAction] = useState({});

  const fetchGroup = useCallback(async () => {
    try {
      const response = await axios.get(`/workflow-group/${groupId}`);
      const data = response.data;
      setGroup(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [groupId]);

  const fetchActions = useCallback(async () => {
    try {
      const response = await axios.get("/workflow-action/all");
      const data = response.data;
      setActions(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchGroup();
    })();
  }, [fetchGroup]);

  useEffect(() => {
    (async () => {
      await fetchActions();
    })();
  }, [fetchActions]);

  useEffect(() => {
    if (group?.actions?.length > 0 && actions.length > 0) {
      group.actions.forEach((s) => {
        setMappedAction((prevState) => {
          return {
            ...prevState,
            [s.id]: true,
          };
        });
      });
    }
  }, [actions, group]);

  async function handleSave() {
    try {
      const includedActions = Object.entries(mappedAction)
        .filter(([, isIncluded]) => isIncluded)
        .map(([id]) => id);

      const payload = {
        id: group.id,
        actions: includedActions.map((ms) => ({
          id: Number(ms),
        })),
      };
      const _ = await axios.put("/workflow-group", payload);
      toast.success("Success", {
        description: "Actions Mapped To Group",
      });
      await fetchGroup();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <div className={"flex flex-col gap-2.5"}>
        <div className={"w-2xl"}>
          <DataTable
            data={actions}
            columns={columns}
            options={{ searchField: "name" }}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default MapActionToGroup;
