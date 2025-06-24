import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

export default function AddForms() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  async function submitHandler(data) {
    try {
      const _ = await axios.post("/form", data);
      toast.success("Success", { description: "Created Form" });
      reset();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={"w-md flex flex-col gap-3"}
      >
        <FormInput
          label={"Form Name"}
          name={"name"}
          register={register}
          error={errors.name}
          validation={{
            required: {
              value: true,
              message: "Form name is required.",
            },
          }}
        />
        <Button type={"submit"} className={"w-full"}>
          Add Form
        </Button>
      </form>
    </div>
  );
}
