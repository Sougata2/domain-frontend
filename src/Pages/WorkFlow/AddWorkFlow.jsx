import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

const defaultValues = {
  name: "",
  status: "",
  targetRole: "",
  targetStatus: "",
  movement: "",
};

const movementOptions = [
  { label: "PROGRESSIVE", value: "PROGRESSIVE" },
  { label: "REGRESSIVE", value: "REGRESSIVE" },
  { label: "PROGRESSIVE_ONE", value: "PROGRESSIVE_ONE" },
];

function AddWorkFlow() {
  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const status = watch("status");

  const [statusOptions, setStatusOptions] = useState([]);
  const [targetStatusOptions, setTargetStatusOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const fetchStatuses = useCallback(async () => {
    try {
      const response = await axios.get("/status/all");
      setStatusOptions(
        response.data.map((d) => ({
          label: `${d.name} [${d.description}]`,
          value: d,
        }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchTargetStatuses = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/find-target-status/${status.value.id}`
      );
      const data = response.data;
      setTargetStatusOptions(
        data.map((d) => ({ label: `${d.name} [${d.description}]`, value: d }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [status]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get("/role");
      const data = response.data;
      setRoleOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchStatuses();
      await fetchRoles();
    })();
  }, [fetchRoles, fetchStatuses]);

  useEffect(() => {
    (async () => {
      if (status) {
        await fetchTargetStatuses();
      }
    })();
  }, [fetchTargetStatuses, status]);

  async function submitHandler(data) {
    try {
      const payload = {
        ...data,
        status: { id: data.status.value.id },
        targetStatus: { id: data.targetStatus.value.id },
        targetRole: { id: data.targetRole.value.id },
        movement: data.movement.value,
      };

      const _ = await axios.post("/workflow-action", payload);
      reset(defaultValues);
      toast.success("Success", { description: "work-flow action saved" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="flex flex-col gap-2 w-3xl"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormSelect
          control={control}
          name={"status"}
          label={"Status"}
          error={errors.status}
          options={statusOptions}
          validations={{
            required: {
              value: true,
              message: "Status is required",
            },
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Action</CardTitle>
            <CardDescription>register an action for the status</CardDescription>
          </CardHeader>
          <CardContent className={"flex flex-col gap-3"}>
            <FormSelect
              control={control}
              isDisabled={!status}
              name={"targetStatus"}
              label={"Target Status"}
              error={errors.targetStatus}
              options={targetStatusOptions}
              validations={{
                required: {
                  value: true,
                  message: "Target Status is required",
                },
              }}
            />
            <FormSelect
              control={control}
              isDisabled={!status}
              name={"targetRole"}
              label={"Target Role"}
              error={errors.targetRole}
              options={roleOptions}
              validations={{
                required: {
                  value: true,
                  message: "Target Role is required",
                },
              }}
            />
            <FormSelect
              control={control}
              isDisabled={!status}
              name={"movement"}
              label={"Movement"}
              error={errors.movement}
              options={movementOptions}
              validations={{
                required: {
                  value: true,
                  message: "Movement is required",
                },
              }}
            />
            <FormInput
              name={"name"}
              disabled={!status}
              register={register}
              label={"Action Name"}
              error={errors.name}
              validation={{
                required: {
                  value: true,
                  message: "Action Name is Required",
                },
              }}
            />
            <div>
              <Button disabled={!status}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default AddWorkFlow;
