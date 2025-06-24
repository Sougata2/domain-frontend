import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

export default function AddSubService() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function submitHandler(data) {
    try {
      const response = await axios.post("/sub-service", data);

      toast.success("Success", { description: "Created Sub Service" });
      reset();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-md flex flex-col gap-2"
      >
        <FormInput
          label={"Sub Service Name"}
          name={"name"}
          register={register}
          error={errors.name}
          validation={{
            required: { value: true, message: "Sub Service Name is required" },
          }}
        />
        <Button className={"w-full"}>Add Sub Service</Button>
      </form>
    </div>
  );
}
