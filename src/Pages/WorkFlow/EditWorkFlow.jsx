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
import { useParams } from "react-router";

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

function EditWorkFlow() {
  const {
    reset,
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { id } = useParams();

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
          value: d.id,
        }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchTargetStatuses = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/find-target-status/${status.value}`
      );
      const data = response.data;
      setTargetStatusOptions(
        data.map((d) => ({
          label: `${d.name} [${d.description}]`,
          value: d.id,
        }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [status]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get("/role");
      const data = response.data;
      setRoleOptions(data.map((d) => ({ label: d.name, value: d.id })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchWorkFlowAction = useCallback(async () => {
    try {
      const response = await axios.get(`/workflow-action/${id}`);
      const data = response.data;
      reset({
        ...data,
        status: { label: data.status.name, value: data.status.id },
        targetStatus: {
          label: `${data.targetStatus.name} [${data.targetStatus.description}]`,
          value: data.status.id,
        },
        targetRole: { label: data.targetRole.name, value: data.targetRole.id },
        movement: { label: data.movement, value: data.movement },
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    (async () => {
      await fetchStatuses();
      await fetchRoles();
    })();
  }, [fetchRoles, fetchStatuses]);

  useEffect(() => {
    (async () => {
      await fetchWorkFlowAction();
    })();
  }, [fetchWorkFlowAction]);

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
        status: { id: data.status.value },
        targetStatus: { id: data.targetStatus.value },
        targetRole: { id: data.targetRole.value },
        movement: data.movement.value,
      };

      const _ = await axios.put("/workflow-action", payload);
      toast.info("Success", { description: "work-flow action Updated" });
      await fetchWorkFlowAction();
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
              <Button>Update</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default EditWorkFlow;
