import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { toast } from "sonner";
import axios from "axios";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";

const typeOptions = [
  { label: "ACTION_WITH_UPLOAD", value: "ACTION_WITH_UPLOAD" },
  { label: "TEST_REPORT_VIEW", value: "TEST_REPORT_VIEW" },
  { label: "CREATE_JOB_CARD", value: "CREATE_JOB_CARD" },
  { label: "TEST_CARD", value: "TEST_CARD" },
  { label: "PAYMENT", value: "PAYMENT" },
  { label: "ACTION", value: "ACTION" },
  { label: "NONE", value: "NONE" },
];

export default function AddStatus() {
  const defaultValues = {
    name: "",
    postDescription: "",
    actionType: "",
  };

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  async function submitHandler(payload) {
    try {
      const response = await axios.post("/status", {
        ...payload,
        actionType: payload.actionType.value,
      });
      const data = response.data;

      toast.success("Success", {
        description: `Status ${data.name} registered`,
      });
      reset(defaultValues);
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
        <div>
          <Button>Add</Button>
        </div>
      </form>
    </div>
  );
}
