// import { CgArrowsExchange } from "react-icons/cg";
import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
// import {
//   ArrowUpDown,
//   CircleX,
//   CrossIcon,
//   Ellipsis,
//   Minus,
//   PenLine,
//   ShieldUser,
//   Trash,
// } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router";
import { toast } from "sonner";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Select from "react-select";
// // import makeAnimated from "react-select/animated";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { useState } from "react";

// const animatedComponents = makeAnimated();

export default function AddUser() {
  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
  };
  // const columns = [
  //   {
  //     accessorKey: "firstName",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           type="button"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           First Name
  //           <ArrowUpDown />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return <div>{row.getValue("firstName")}</div>;
  //     },
  //   },
  //   {
  //     accessorKey: "middleName",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant={"ghost"}
  //           type="button"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Middle Name
  //           <ArrowUpDown />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return <div>{row.getValue("middleName")}</div>;
  //     },
  //   },
  //   {
  //     accessorKey: "lastName",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant={"ghost"}
  //           type="button"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Last Name
  //           <ArrowUpDown />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return <div>{row.getValue("lastName")}</div>;
  //     },
  //   },
  //   {
  //     accessorKey: "email",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant={"ghost"}
  //           type="button"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Last Name
  //           <ArrowUpDown />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return <div>{row.getValue("email")}</div>;
  //     },
  //   },
  //   {
  //     accessorKey: "id",
  //     header: () => {
  //       return <div>Actions</div>;
  //     },
  //     cell: ({ row }) => {
  //       return <UserActionsMenu id={row.getValue("id")} />;
  //     },
  //   },
  // ];

  const [formData, setFormData] = useState(initialValues);
  // const [users, setUsers] = useState([]);

  // const fetchUsers = useCallback(async () => {
  //   try {
  //     const response = await axios.get(
  //       import.meta.env.VITE_SERVER_URL + "/user"
  //     );
  //     setUsers(response.data);
  //   } catch (error) {
  //     toast.error("Error", { description: error.message });
  //   }
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     await fetchUsers();
  //   })();
  // }, [fetchUsers]);

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
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/user",
        formData
      );
      const _ = response.data;
      setFormData(initialValues);
      toast.success("Success", { description: "User Added" });
      // await fetchUsers();
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
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"password"}>Password</Label>
          <Input
            name="password"
            placeholder={"Password"}
            value={formData.password}
            id={"password"}
            type={"password"}
            onChange={onChange}
          />
        </div>
        <Button>Add User</Button>
      </form>

      {/* <div className="w-3xl">
        <DataTable
          data={users}
          columns={columns}
          options={{ searchField: "email" }}
        />
      </div> */}
    </div>
  );
}

// const UserActionsMenu = ({ id }) => {
//   const navigate = useNavigate();
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Ellipsis />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56">
//         <DropdownMenuGroup>
//           <AddRoleDrawer userId={id} />
//           <DefaultRoleChange userId={id} />
//           <DropdownMenuItem>
//             <div
//               className={
//                 "flex gap-2 justify-center items-center cursor-pointer"
//               }
//             >
//               <PenLine />
//               <div onClick={() => navigate(`/edit-user/${id}`)}>Edit</div>
//             </div>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <div
//               className={
//                 "flex gap-2 justify-center items-center cursor-pointer"
//               }
//             >
//               <Trash />
//               <div>Delete</div>
//             </div>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// const AddRoleDrawer = ({ userId }) => {
//   const addRoleRef = useRef(null);
//   const defaultRoleRef = useRef(null);
//   const [assignedRoles, setAssignedRoles] = useState([]);
//   const [unAssignedRoles, setUnAssignedRoles] = useState([]);
//   const [defaultRole, setDefaultRole] = useState(null);
//   const [selectedDefaultRole, setSelectedDefaultRole] = useState(null);
//   const [rolesToAssign, setRolesToAssign] = useState([]);
//   const [defaultRoleOptions, setDefaultRoleOptions] = useState([]);

//   const fetchAssignedRoles = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         import.meta.env.VITE_SERVER_URL +
//           `/user-role-map?userId=${userId}`
//       );
//       const data = response.data.map((d) => ({
//         label: d.role.roleName,
//         value: d.role,
//       }));
//       setAssignedRoles(data);
//     } catch (error) {
//       toast.error("Error", { description: error.message });
//     }
//   }, [userId]);

//   const fetchUnAssignedRoles = useCallback(async () => {
//     const response = await axios.get(
//       import.meta.env.VITE_SERVER_URL +
//         `/user-role-map/not-assigned-roles/${userId}`
//     );

//     const data = response.data.map((d) => ({
//       label: d.roleName,
//       value: d,
//     }));
//     setUnAssignedRoles(data);
//   }, [userId]);

//   const fetchDefaultRole = useCallback(async () => {
//     const response = await axios.get(
//       import.meta.env.VITE_SERVER_URL +
//         `/user-role-map/default-role/${userId}`
//     );
//     if (response.status === 200) {
//       setDefaultRole({
//         label: response.data.roleName,
//         value: { ...response.data },
//       });
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (userId) {
//       (async () => {
//         await fetchAssignedRoles();
//         await fetchUnAssignedRoles();
//         await fetchDefaultRole();
//       })();
//     }
//   }, [userId, fetchAssignedRoles, fetchDefaultRole, fetchUnAssignedRoles]);

//   useEffect(() => {
//     setDefaultRoleOptions([...assignedRoles, ...rolesToAssign]);
//     if (defaultRoleRef.current) {
//       defaultRoleRef.current.clearValue();
//     }
//   }, [assignedRoles, rolesToAssign]);

//   useEffect(() => {}, []);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       const payloadArray = rolesToAssign.map((rta) => ({
//         user: { id: userId },
//         role: { id: rta.value.id },
//         isDefault: selectedDefaultRole?.value.id === rta.value.id ? 1 : 0,
//       }));
//       const response = await axios.post(
//         import.meta.env.VITE_SERVER_URL + "/user-role-map/bulk",
//         payloadArray
//       );
//       const _ = response.data;

//       // reset the values
//       await fetchAssignedRoles();
//       await fetchUnAssignedRoles();
//       await fetchDefaultRole();
//       addRoleRef.current.clearValue();
//       toast.success("Success", { description: "Roles assigned successfully" });
//     } catch (error) {
//       toast.error("Error", { description: error.message });
//     }
//   }

//   async function handleDelete(userId, roleId) {
//     try {
//       const response = await axios.delete(
//         import.meta.env.VITE_SERVER_URL +
//           `/user-role-map?userId=${userId}&roleId=${roleId}`
//       );
//       const _ = response.data;
//       toast.warning("Deleted", { description: "User Role Map Deleted" });
//       await fetchAssignedRoles();
//       await fetchUnAssignedRoles();
//     } catch (error) {
//       toast.error("Error", { description: error.message });
//     }
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <DropdownMenuItem
//           onSelect={(e) => e.preventDefault()} // prevents menu from closing
//           className="cursor-pointer flex items-center gap-2"
//         >
//           <ShieldUser />
//           <div>Manage Roles</div>
//         </DropdownMenuItem>
//       </DrawerTrigger>
//       <DrawerContent className="min-h-[80vh] max-h-[100vh]">
//         <div className="mx-auto w-full max-w-md">
//           <DrawerHeader>
//             <DrawerTitle>Manage Roles</DrawerTitle>
//             <DrawerDescription>Give access based on roles</DrawerDescription>
//           </DrawerHeader>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col items-center justify-center gap-3.5 my-5">
//               {defaultRole && (
//                 <div className={"w-full flex flex-col gap-2.5"}>
//                   <Label>Default Role</Label>
//                   <div className={"flex gap-2 flex-wrap"}>
//                     <div
//                       className={
//                         "shadow bg-gray-100 flex gap-2.5 justify-between items-center px-2 rounded-2xl"
//                       }
//                     >
//                       {defaultRole.label}
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className={"w-full flex flex-col gap-2.5"}>
//                 <Label>Assigned Roles</Label>
//                 {assignedRoles.length === 0 && <div>No Roles assigned</div>}
//                 {assignedRoles.length > 0 && (
//                   <div className={"flex gap-2 flex-wrap"}>
//                     {assignedRoles.map((r) => (
//                       <div
//                         className={
//                           "shadow bg-gray-100 flex gap-2.5 justify-between items-center px-2 rounded-2xl"
//                         }
//                         key={r.value.id}
//                       >
//                         {r.label}
//                         {r.value.id !== defaultRole?.value.id && (
//                           <CircleX
//                             size={"16px"}
//                             className={"text-red-400 hover:text-red-500"}
//                             onClick={() => handleDelete(userId, r.value.id)}
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className={"w-full flex flex-col gap-2.5"}>
//                 <Label>Add Roles</Label>
//                 <Select
//                   ref={addRoleRef}
//                   className={"w-full"}
//                   closeMenuOnSelect={false}
//                   placeholder={"Add Roles"}
//                   components={animatedComponents}
//                   isMulti
//                   options={unAssignedRoles}
//                   onChange={(e) => {
//                     setRolesToAssign([...e]);
//                   }}
//                   required
//                 />
//               </div>
//               {!defaultRole && (
//                 <div className={"w-full flex flex-col gap-2.5"}>
//                   <Label>Default Role</Label>
//                   <Select
//                     ref={defaultRoleRef}
//                     className={"w-full"}
//                     placeholder={"Select Default Role"}
//                     options={defaultRoleOptions}
//                     onChange={(e) => setSelectedDefaultRole(e)}
//                     defaultValue={defaultRole}
//                   />
//                 </div>
//               )}
//             </div>
//             <DrawerFooter>
//               <Button>Submit</Button>
//               <DrawerClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </form>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// const DefaultRoleChange = ({ userId }) => {
//   const defaultRoleRef = useRef(null);
//   const [defaultRole, setDefaultRole] = useState(null);
//   const [assignedRoles, setAssignedRoles] = useState([]);
//   const [newDefaultRole, setNewDefaultRole] = useState(null);

//   const fetchDefaultRole = useCallback(async () => {
//     const response = await axios.get(
//       import.meta.env.VITE_SERVER_URL +
//         `/user-role-map/default-role/${userId}`
//     );
//     if (response.status === 200) {
//       setDefaultRole({
//         label: response.data.roleName,
//         value: { ...response.data },
//       });
//     }
//   }, [userId]);

//   const fetchAssignedRoles = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         import.meta.env.VITE_SERVER_URL +
//           `/user-role-map?userId=${userId}`
//       );
//       const data = response.data.map((d) => ({
//         label: d.role.roleName,
//         value: d.role,
//       }));
//       setAssignedRoles(data);
//     } catch (error) {
//       toast.error("Error", { description: error.message });
//     }
//   }, [userId]);

//   useEffect(() => {
//     (async () => {
//       await fetchDefaultRole();
//       await fetchAssignedRoles();
//     })();
//   }, [fetchDefaultRole, fetchAssignedRoles]);

//   async function handleSubmit(e) {
//     e.preventDefault();

//     try {
//       const payload = {
//         userId,
//         newRoleId: newDefaultRole.value.id,
//         oldRoleId: defaultRole.value.id,
//       };
//       console.log(payload);

//       const response = await axios.put(
//         import.meta.env.VITE_SERVER_URL +
//           "/user-role-map/update-default-role",
//         payload
//       );
//       const _ = response.data;
//       setNewDefaultRole(null);
//       await fetchDefaultRole();
//       await fetchAssignedRoles();
//       defaultRoleRef.current.clearValue();
//       toast.success("Success", { description: "Default Role Updated!" });
//     } catch (error) {
//       toast.error("Error", { description: error.message });
//     }
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <DropdownMenuItem
//           onSelect={(e) => e.preventDefault()} // prevents menu from closing
//           className="cursor-pointer flex items-center gap-2"
//         >
//           <CgArrowsExchange />
//           <div>Default Roles</div>
//         </DropdownMenuItem>
//       </DrawerTrigger>
//       <DrawerContent className="min-h-[60vh] max-h-[100vh]">
//         <div className="mx-auto w-full max-w-md">
//           <DrawerHeader>
//             <DrawerTitle>Default Role</DrawerTitle>
//             <DrawerDescription>
//               Give access based on default role
//             </DrawerDescription>
//           </DrawerHeader>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col items-center justify-center gap-3.5 my-5">
//               {defaultRole && (
//                 <div className={"w-full flex flex-col gap-2.5"}>
//                   <Label>Default Role</Label>
//                   <div className={"flex gap-2 flex-wrap"}>
//                     <div
//                       className={
//                         "shadow bg-gray-100 flex gap-2.5 justify-between items-center px-2 rounded-2xl"
//                       }
//                     >
//                       {defaultRole.label}
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className={"w-full flex flex-col gap-2.5"}>
//                 <Label>Default Role</Label>
//                 <Select
//                   ref={defaultRoleRef}
//                   className={"w-full"}
//                   placeholder={"Select Default Role"}
//                   options={assignedRoles}
//                   onChange={(e) => setNewDefaultRole(e)}
//                   filterOption={(option) =>
//                     option.value.id !== defaultRole.value.id
//                   }
//                 />
//               </div>
//             </div>
//             <DrawerFooter>
//               <Button>Submit</Button>
//               <DrawerClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </form>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// };
