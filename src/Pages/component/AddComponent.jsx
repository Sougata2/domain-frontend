import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

const defaultValues = {
  name: "",
  applicationType: "",
};

function AddComponent() {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  async function handleOnSubmit(data) {
    try {
      const payload = { ...data, applicationType: data.applicationType.value };
      await axios.post("/view-component", payload);
      toast.success("Success", { description: "Component Added Successfully" });
      reset(defaultValues);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="w-md flex flex-col gap-3.5"
      >
        <div>
          <FormInput
            register={register}
            label={"Name"}
            name={"name"}
            error={errors.name}
            validation={{
              required: {
                value: true,
                message: "Component Name is required",
              },
            }}
          />
        </div>
        <div>
          <FormSelect
            control={control}
            error={errors.applicationType}
            label={"Type"}
            name={"applicationType"}
            options={[
              { label: "APPLICATION", value: "APPLICATION" },
              { label: "JOB", value: "JOB" },
            ]}
            validations={{
              required: {
                value: true,
                message: "Type is required",
              },
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button>Add</Button>
        </div>
      </form>
    </div>
  );
}

export default AddComponent;
