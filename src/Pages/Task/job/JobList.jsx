import TanstackTable from "@/components/TanstackTable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";
import { BiTask } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router";

function JobList() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "device.name",
        header: () => <div>Device</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "status.postDescription",
        header: () => <div>Status</div>,
        cell: (row) => (
          <div>
            <Badge variant={"secondary"} className={"capitalize"}>
              {row.getValue()}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "lab.name",
        header: () => <div>LAB</div>,
        cell: (row) => <div>{row.getValue()}</div>,
      },
      {
        accessorKey: "createdAt",
        header: () => <div>Request Date</div>,
        cell: (row) => (
          <div>{format(new Date(row.getValue()), "dd-MM-yyyy")}</div>
        ),
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        header: () => <div></div>,
        cell: (row) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BiTask />
                    <Link to={`/job-view/${row.getValue()}`}>View</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const { id: userId } = useSelector((state) => state.user);
  const [refreshKey, _] = useState(0);

  return (
    <div className="flex justify-center items-center">
      {userId && (
        <TanstackTable
          columns={columns}
          postURL={`/job/search`}
          refreshKey={refreshKey}
          extraFilters={{ "assignee.id": userId }}
        />
      )}
    </div>
  );
}

export default JobList;
