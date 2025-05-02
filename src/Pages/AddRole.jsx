import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useCallback, useEffect, useState} from "react";
import {toast} from "sonner";
import axios from "axios";
import {ArrowUpDown} from "lucide-react";
import {useNavigate} from "react-router";
import DataTable from "@/DomainComponents/DataTable.jsx";

function AddRole() {
    const initialValues = {
        "roleName": "",
        "employees": []
    };
    const [formData, setFormData] = useState(initialValues);
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const columns = [
        {
            accessorKey: "roleName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Role Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return <div>{row.getValue("roleName")}</div>;
            },
        },
        {
            accessorKey: "id",
            header: () => {
                return <div>Actions</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => navigate(`/edit-role/${row.getValue("id")}`)}
                            className={
                                "bg-emerald-400 hover:bg-emerald-500 text-emerald-700 hover:text-emerald-800"
                            }
                        >
                            Edit
                        </Button>
                        <Button
                            className={
                                "bg-red-400 hover:bg-red-500 text-red-700 hover:text-red-800"
                            }
                        >
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];

    const fetchRoles = useCallback(async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_SERVER_URL + "/role");
            const data = response.data;
            setRoles(data);
        }catch (e) {
            toast.error("Error", {description: e.message});
        }
    }, [])

    useEffect(() => {
        (async () => {
            await fetchRoles();
        })();
    }, [fetchRoles]);

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
            const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/role`, formData);
            const data = response.data;
            setFormData(data)
            toast.success("Success", {description: "Role Added Successfully"});
            await fetchRoles();
        }catch (e) {
            toast.error("Error", {description: e.message });
        }
    }

    return (
        <div className={"flex flex-col gap-4 justify-center items-center py-12"}>
            <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
                <div className={"flex flex-col gap-2.5"}>
                    <Label htmlFor={"roleName"}>Role Name</Label>
                    <Input
                        name="roleName"
                        placeholder={"Role Name"}
                        value={formData.roleName}
                        id={"roleName"}
                        onChange={onChange}
                    />
                </div>

                <Button>Add Role</Button>
            </form>

            <div className="w-xl">
                <DataTable
                    data={roles}
                    columns={columns}
                    options={{ searchField: "roleName" }}
                />
            </div>
        </div>
    );
}

export default AddRole;