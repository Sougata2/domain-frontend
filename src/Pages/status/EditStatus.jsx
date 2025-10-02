import { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

const typeOptions = [
  { label: "ACTION_WITH_UPLOAD", value: "ACTION_WITH_UPLOAD" },
  { label: "TEST_REPORT_VIEW", value: "TEST_REPORT_VIEW" },
  { label: "CREATE_JOB_CARD", value: "CREATE_JOB_CARD" },
  { label: "TEST_CARD", value: "TEST_CARD" },
  { label: "PAYMENT", value: "PAYMENT" },
  { label: "ACTION", value: "ACTION" },
  { label: "NONE", value: "NONE" },
];

export default function EditStatus() {
  const defaultValues = {
    name: "",
    description: "",
  };

  const { id: statusId } = useParams();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const fetchStatusById = useCallback(async () => {
    try {
      const response = await axios.get(`/status/${statusId}`);
      const data = response.data;
      reset({
        ...data,
        actionType: data.actionType
          ? { label: data.actionType, value: data.actionType }
          : null,
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [reset, statusId]);

  useEffect(() => {
    (async () => {
      await fetchStatusById();
    })();
  }, [fetchStatusById]);

  async function submitHandler(payload) {
    try {
      const { id, name, description, actionType, ..._ } = payload;
      const response = await axios.put("/status", {
        id,
        name,
        description,
        actionType: actionType.value,
      });
      const data = response.data;

      toast.success("Success", {
        description: `Status ${data.name} Updated`,
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-3 w-md"
      >
        <FormInput
          label={"Status Name"}
          name={"name"}
          register={register}
          error={errors.name}
          validation={{
            required: {
              value: true,
              message: "Status Name is required",
            },
            pattern: {
              value: /^[A-Z]+$/,
              message: "Status Name must be in Caps",
            },
          }}
        />
        <FormInput
          label={"Status Description"}
          name={"description"}
          register={register}
          error={errors.description}
          validation={{
            required: {
              value: true,
              message: "Status Description is required",
            },
          }}
        />
        <FormSelect
          control={control}
          name={"actionType"}
          label={"Action Type"}
          error={errors.actionType}
          options={typeOptions}
          validations={{
            required: {
              value: true,
              message: "Action Type is required",
            },
          }}
        />
        <div>
          <Button>Update</Button>
        </div>
      </form>
    </div>
  );
}
