import { CgArrowsExchange } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
import {
  ArrowUpDown,
  CircleX,
  Ellipsis,
  PenLine,
  ShieldUser,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Label } from "@/components/ui/label";

const animatedComponents = makeAnimated();

export default function ManageUser() {
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
        return <UserActionsMenu id={row.getValue("id")} />;
      },
    },
  ];

  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/user"
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, [fetchUsers]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center py-12">
      <DataTable
        data={users}
        columns={columns}
        options={{ searchField: "email" }}
      />
    </div>
  );
}

const UserActionsMenu = ({ id }) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <AddRoleDrawer userId={id} />
          <DefaultRoleChange userId={id} />
          <DropdownMenuItem>
            <div
              className={
                "flex gap-2 justify-center items-center cursor-pointer"
              }
            >
              <PenLine />
              <div onClick={() => navigate(`/edit-user/${id}`)}>Edit</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className={
                "flex gap-2 justify-center items-center cursor-pointer"
              }
            >
              <Trash />
              <div>Delete</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AddRoleDrawer = ({ userId }) => {
  const addRoleRef = useRef(null);
  const defaultRoleRef = useRef(null);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [unAssignedRoles, setUnAssignedRoles] = useState([]);
  const [defaultRole, setDefaultRole] = useState(null);
  const [selectedDefaultRole, setSelectedDefaultRole] = useState(null);
  const [rolesToAssign, setRolesToAssign] = useState([]);
  const [defaultRoleOptions, setDefaultRoleOptions] = useState([]);
  const [user, setUser] = useState({});

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/user/${userId}`
      );
      setUser(response.data);

      const assignedRolesTrack = response.data.roles.map((r) => r.id);

      setAssignedRoles(
        response.data.roles.map((role) => ({ label: role.name, value: role }))
      );
      const allRoles = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/role`
      );
      setUnAssignedRoles(
        allRoles.data
          .filter((r) => !assignedRolesTrack.includes(r.id))
          .map((r) => ({ label: r.name, value: r }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [userId]);

  const fetchDefaultRole = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/user/default-role/${userId}`
      );
      setDefaultRole({ label: response.data.name, value: response.data });
    } catch (error) {
      if (error.status !== 404)
        toast.error("Error", { description: error.message });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      (async () => {
        await fetchUser();
        await fetchDefaultRole();
      })();
    }
  }, [userId, fetchDefaultRole, fetchUser]);

  useEffect(() => {
    setDefaultRoleOptions([...assignedRoles, ...rolesToAssign]);
    if (defaultRoleRef.current) {
      defaultRoleRef.current.clearValue();
    }
  }, [assignedRoles, rolesToAssign]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const roles = [
        ...assignedRoles.map((r) => ({ id: r.value.id })),
        ...rolesToAssign.map((r) => ({ id: r.value.id })),
      ];
      const payload = {
        ...user,
        roles,
        defaultRole: selectedDefaultRole
          ? { id: selectedDefaultRole.value.id }
          : null,
      };

      const _ = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/user",
        payload
      );

      // reset the values
      await fetchUser();
      await fetchDefaultRole();
      addRoleRef.current.clearValue();
      toast.success("Success", { description: "Roles assigned successfully" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleDelete(userId, roleId) {
    try {
      const response = await axios.delete(
        import.meta.env.VITE_SERVER_URL +
          `/user-role-map?userId=${userId}&roleId=${roleId}`
      );
      const _ = response.data;
      await fetchUser();
      toast.warning("Deleted", { description: "Removed Access" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // prevents menu from closing
          className="cursor-pointer flex items-center gap-2"
        >
          <ShieldUser />
          <div>Manage Roles</div>
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent className="min-h-[80vh] max-h-[100vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Manage Roles</DrawerTitle>
            <DrawerDescription>Give access based on roles</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-3.5 my-5">
              {defaultRole && (
                <div className={"w-full flex flex-col gap-2.5"}>
                  <Label>Default Role</Label>
                  <div className={"flex gap-2 flex-wrap"}>
                    <div
                      className={
                        "shadow bg-gray-100 flex gap-2.5 justify-between items-center px-2 rounded-2xl"
                      }
                    >
                      {defaultRole.label}
                    </div>
                  </div>
                </div>
              )}
              <div className={"w-full flex flex-col gap-2.5"}>
                <Label>Assigned Roles</Label>
                {assignedRoles.length === 0 && <div>No Roles assigned</div>}
                {assignedRoles.length > 0 && (
                  <div className={"flex gap-2 flex-wrap"}>
                    {assignedRoles.map((r) => (
                      <div
                        className={
                          "shadow bg-gray-100 flex gap-2.5 justify-between items-center px-2 rounded-2xl"
                        }
                        key={r.value.id}
                      >
                        {r.label}
                        {r.value.id !== defaultRole?.value.id && (
                          <CircleX
                            size={"16px"}
                            className={"text-red-400 hover:text-red-500"}
                            onClick={() => handleDelete(userId, r.value.id)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={"w-full flex flex-col gap-2.5"}>
                <Label>Add Roles</Label>
                <Select
                  ref={addRoleRef}
                  className={"w-full"}
                  closeMenuOnSelect={false}
                  placeholder={"Add Roles"}
                  components={animatedComponents}
                  isMulti
                  options={unAssignedRoles}
                  onChange={(e) => {
                    setRolesToAssign([...e]);
                  }}
                  required
                />
              </div>
              {!defaultRole && (
                <div className={"w-full flex flex-col gap-2.5"}>
                  <Label>Default Role</Label>
                  <Select
                    ref={defaultRoleRef}
                    className={"w-full"}
                    placeholder={"Select Default Role"}
                    options={defaultRoleOptions}
                    onChange={(e) => setSelectedDefaultRole(e)}
                    defaultValue={defaultRole}
                  />
                </div>
              )}
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const DefaultRoleChange = ({ userId }) => {
  const defaultRoleRef = useRef(null);
  const [defaultRole, setDefaultRole] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [newDefaultRole, setNewDefaultRole] = useState(null);

  const fetchDefaultRole = useCallback(async () => {
    const response = await axios.get(
      import.meta.env.VITE_SERVER_URL + `/user-role-map/default-role/${userId}`
    );
    if (response.status === 200) {
      setDefaultRole({
        label: response.data.roleName,
        value: { ...response.data },
      });
    }
  }, [userId]);

  const fetchAssignedRoles = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/user-role-map?userId=${userId}`
      );
      const data = response.data.map((d) => ({
        label: d.role.roleName,
        value: d.role,
      }));
      setAssignedRoles(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [userId]);

  useEffect(() => {
    (async () => {
      await fetchDefaultRole();
      await fetchAssignedRoles();
    })();
  }, [fetchDefaultRole, fetchAssignedRoles]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        userId,
        newRoleId: newDefaultRole.value.id,
        oldRoleId: defaultRole.value.id,
      };

      const response = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/user-role-map/update-default-role",
        payload
      );
      const _ = response.data;
      setNewDefaultRole(null);
      await fetchDefaultRole();
      await fetchAssignedRoles();
      defaultRoleRef.current.clearValue();
      toast.success("Success", { description: "Default Role Updated!" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // prevents menu from closing
          className="cursor-pointer flex items-center gap-2"
        >
          <CgArrowsExchange />
          <div>Default Roles</div>
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent className="min-h-[60vh] max-h-[100vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Default Role</DrawerTitle>
            <DrawerDescription>
              Give access based on default role
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-3.5 my-5">
              {defaultRole && (
                <div className={"w-full flex flex-col gap-2.5"}>
                  <Label>Default Role</Label>
                  <div className={"flex gap-2 flex-wrap"}>
                    <div
                      className={
                        "shadow bg-gray-100 flex gap-2.5 justify-between items-center px-2 rounded-2xl"
                      }
                    >
                      {defaultRole.label}
                    </div>
                  </div>
                </div>
              )}
              <div className={"w-full flex flex-col gap-2.5"}>
                <Label>Default Role</Label>
                <Select
                  ref={defaultRoleRef}
                  className={"w-full"}
                  placeholder={"Select Default Role"}
                  options={assignedRoles}
                  onChange={(e) => setNewDefaultRole(e)}
                  filterOption={(option) =>
                    option.value.id !== defaultRole.value.id
                  }
                />
              </div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
