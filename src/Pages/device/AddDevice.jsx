import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/DomainComponents/FormInput";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import FormSelectMulti from "@/DomainComponents/FormComponents/FormSelectMulti";
import DataTable from "@/DomainComponents/DataTable";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";

const defaultValues = {
  id: "",
  name: "",
  height: "",
  heightUnit: "",
  weight: "",
  weightUnit: "",
  length: "",
  lengthUnit: "",
  activities: [],
  specifications: [],
  application: "",
  quantity: "",
  remarks: "",
};

function AddDevice() {
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
            Device Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "activities",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Activity
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3 flex gap-1 flex-wrap">
            {row.getValue("activities").map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "specifications",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Specifications
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3 flex gap-1 flex-wrap">
            {row.getValue("specifications").map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div>Actions</div>;
      },
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <CiEdit />
                  <button onClick={() => handleEditDevice(row.getValue("id"))}>
                    Edit
                  </button>
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

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
  });

  const { referenceNumber } = useParams();

  const selectedActivties = watch("activities");
  const selectedSpecification = watch("specifications");

  const specificationRef = useRef(null);
  const activityRef = useRef(null);

  const [specificationOptions, setSpecificationOptions] = useState([]);
  const [activitieOptions, setActivitieOptions] = useState([]);
  const [subService, setSubService] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [devices, setDevices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchApplicationData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-reference-id/${referenceNumber}`
      );
      const data = response.data;
      setSubService(data.subService);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axios.get(
        `/activity/by-sub-service/${subService.id}`
      );
      const data = response.data;
      const formattedData = data.map((d) => ({ label: d.name, value: d }));
      formattedData.sort((a, b) => a.label.localeCompare(b.label));
      setActivitieOptions(formattedData);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [subService]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(
        `/device/by-application-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setDevices(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const clearMultiSelectValues = (field) => {
    switch (field) {
      case "*":
        specificationRef.current.clearValue();
        activityRef.current.clearValue();
        break;
      case "specification":
        specificationRef.current.clearValue();
        break;
      case "acitivity":
        activityRef.current.clearValue();
        break;
      default:
        toast.error("Unknown Field");
        break;
    }
  };

  useEffect(() => {
    (async () => {
      if (referenceNumber) {
        await fetchApplicationData();
      }
    })();
  }, [fetchApplicationData, referenceNumber]);

  useEffect(() => {
    if (subService) {
      (async () => {
        await fetchActivities();
      })();
    }
  }, [fetchActivities, subService]);

  useEffect(() => {
    (async () => {
      await fetchDevices();
    })();
  }, [fetchDevices]);

  async function handleOnSubmit(data) {
    try {
      const payload = {
        ...data,
        heightUnit: data.heightUnit.value,
        lengthUnit: data.lengthUnit.value,
        weightUnit: data.weightUnit.value,
        activities: data.activities.map((d) => ({ id: d.value.id })),
        specifications: data.specifications.map((d) => ({ id: d.value.id })),
        application: isEditing ? null : { referenceNumber: referenceNumber },
      };

      if (isEditing) {
        await axios.put("/device", payload);
        toast.info("Updated", { description: "Device Updated" });
      } else {
        await axios.post("/device", payload);
        toast.success("Success", { description: "Device Saved" });
      }
      setIsEditing(false);
      reset(defaultValues);
      clearMultiSelectValues("*");
      await fetchDevices();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleEditDevice(deviceId) {
    try {
      setIsEditing(true);
      const response = await axios.get(`/device/${deviceId}`);
      const data = response.data;
      const { createdAt, updatedAt, ...formattedData } = {
        ...data,
        activities: data.activities.map((d) => ({ label: d.name, value: d })),
        specifications: data.specifications.map((d) => ({
          label: d.name,
          value: d,
        })),
        heightUnit: { label: data.heightUnit, value: data.heightUnit },
        lengthUnit: { label: data.lengthUnit, value: data.lengthUnit },
        weightUnit: { label: data.weightUnit, value: data.weightUnit },
      };
      reset(formattedData);

      // apply the saved values in the multi select options
      activityRef.current?.setValue(formattedData.activities, "set-value");
      specificationRef.current?.setValue(
        formattedData.specifications,
        "set-value"
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/device", {
        data: { id },
      });
      setDeleteId("");
      await fetchDevices();
      toast.warning("Deleted", { description: "Device Deleted" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Register Device</CardTitle>
            <CardDescription>
              Register your device for Testing activity
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="flex flex-col gap-3.5"
          >
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label={"Device Name"}
                  name={"name"}
                  register={register}
                  error={errors.name}
                  validation={{
                    required: {
                      value: true,
                      message: "Device Name is required",
                    },
                  }}
                />
                <FormInput
                  label={"Device Height"}
                  name={"height"}
                  register={register}
                  error={errors.height}
                  validation={{
                    required: {
                      value: true,
                      message: "Device height is required",
                    },
                    min: {
                      value: 1,
                      message: "Heigth cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
                <FormSelect
                  control={control}
                  label={"Unit of Device Length"}
                  name={"lengthUnit"}
                  options={[
                    { label: "mm", value: "mm" },
                    { label: "cm", value: "cm" },
                    { label: "m", value: "m" },
                  ]}
                  error={errors.lengthUnit}
                  validations={{
                    required: {
                      value: true,
                      message: "Length unit is required",
                    },
                  }}
                />
                <FormInput
                  label={"Device Weight"}
                  name={"weight"}
                  register={register}
                  error={errors.weight}
                  validation={{
                    required: {
                      value: true,
                      message: "Device Weight is required",
                    },
                    min: {
                      value: 1,
                      message: "Weigth cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
                <FormSelect
                  control={control}
                  label={"Unit of Device Weigth"}
                  name={"weightUnit"}
                  options={[
                    { label: "mg", value: "mg" },
                    { label: "g", value: "g" },
                    { label: "kg", value: "kg" },
                  ]}
                  error={errors.weightUnit}
                  validations={{
                    required: {
                      value: true,
                      message: "Weigth unit is required",
                    },
                  }}
                />
                <FormInput
                  label={"Device Length"}
                  name={"length"}
                  register={register}
                  error={errors.length}
                  validation={{
                    required: {
                      value: true,
                      message: "Device Length is required",
                    },
                    min: {
                      value: 1,
                      message: "Length cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
                <FormSelect
                  control={control}
                  label={"Unit of Device Height"}
                  name={"heightUnit"}
                  options={[
                    { label: "mm", value: "mm" },
                    { label: "cm", value: "cm" },
                    { label: "m", value: "m" },
                  ]}
                  error={errors.heightUnit}
                  validations={{
                    required: {
                      value: true,
                      message: "Heigth unit is required",
                    },
                  }}
                />
                <Controller
                  name="activities"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Activities are required",
                    },
                  }}
                  render={() => (
                    <FormSelectMulti
                      ref={activityRef}
                      name={"activities"}
                      label={"Activities"}
                      defaultValue={selectedActivties}
                      disabled={
                        activitieOptions && activitieOptions.length === 0
                      }
                      options={activitieOptions}
                      error={errors.activities}
                      handleOnChange={(e) => {
                        setValue("activities", [...e]);

                        // clear the specifications options only
                        // when activity is delete form multi select combo.
                        if (e.length < selectedActivties.length)
                          clearMultiSelectValues("specification");

                        setSpecificationOptions(() => {
                          const specs = [];
                          e.forEach((ac) =>
                            specs.push(
                              ...ac.value.specifications.map((s) => ({
                                label: s.name,
                                value: s,
                              }))
                            )
                          );
                          specs.sort((a, b) => a.label.localeCompare(b.label));
                          return specs;
                        });
                      }}
                    />
                  )}
                />
                <Controller
                  name="specifications"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Specifications are required",
                    },
                  }}
                  render={() => (
                    <FormSelectMulti
                      ref={specificationRef}
                      name={"specifications"}
                      label={"Specifications"}
                      defaultValue={selectedSpecification}
                      disabled={
                        specificationOptions &&
                        specificationOptions.length === 0
                      }
                      error={errors.specifications}
                      options={specificationOptions}
                      handleOnChange={(e) => {
                        setValue("specifications", [...e]);
                      }}
                    />
                  )}
                />
                <FormInput
                  label={"Quantity"}
                  name={"quantity"}
                  register={register}
                  error={errors.quantity}
                  validation={{
                    required: {
                      value: true,
                      message: "Quantity is required",
                    },
                    min: {
                      value: 1,
                      message: "Quantity cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
              </div>
            </CardContent>
            <CardFooter className={"flex justify-end gap-2"}>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  isEditing(false);
                  reset(defaultValues);
                  activityRef.current.clearValue();
                  specificationRef.current.clearValue();
                }}
              >
                Reset
              </Button>
              {!isEditing && <Button>Save</Button>}
              {isEditing && <Button>Update</Button>}
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className={"flex justify-center items-center"}>
        <ConfirmationAlert
          isOpen={openAlert}
          closeHandler={() => setOpenAlert(false)}
          handleConfirm={() => {
            handleDelete(deleteId);
            setOpenAlert(false);
          }}
        />
        <div className="w-3xl mt-5">
          <div>Devices</div>
          <DataTable
            columns={columns}
            data={devices}
            options={{ searchField: "name" }}
          />
        </div>
      </div>
    </div>
  );
}

export default AddDevice;
