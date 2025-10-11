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
  { label: "ISSUE_CERTIFICATE", value: "ISSUE_CERTIFICATE" },
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
    postDescription: "",
    actionType: "",
    applicationType: "",
    isFinal: "",
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
        applicationType: {
          label: data.applicationType,
          value: data.applicationType,
        },
        isFinal: {
          label: data.isFinal ? "True" : "False",
          value: data.isFinal,
        },
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
      const {
        id,
        name,
        actionType,
        postDescription,
        applicationType,
        isFinal,
        ..._
      } = payload;
      const response = await axios.put("/status", {
        id,
        name,
        postDescription,
        actionType: actionType.value,
        applicationType: applicationType.value,
        isFinal: isFinal.value,
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
          label={"Status Post Description"}
          name={"postDescription"}
          register={register}
          error={errors.postDescription}
          validation={{
            required: {
              value: true,
              message: "Status Post Description is required",
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
        <FormSelect
          control={control}
          name={"applicationType"}
          label={"Application Type"}
          error={errors.applicationType}
          options={[
            { label: "APPLICATION", value: "APPLICATION" },
            { label: "JOB", value: "JOB" },
          ]}
          validations={{
            required: {
              value: true,
              message: "Action Type is required",
            },
          }}
        />
        <FormSelect
          control={control}
          name={"isFinal"}
          label={"Final Status"}
          error={errors.isFinal}
          options={[
            { label: "True", value: true },
            { label: "False", value: false },
          ]}
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
