import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { toast } from "sonner";
import axios from "axios";

export default function AddStatus() {
  const defaultValues = {
    name: "",
    description: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  async function submitHandler(payload) {
    try {
      const response = await axios.post("/status", payload);
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
        <div>
          <Button>Add</Button>
        </div>
      </form>
    </div>
  );
}
