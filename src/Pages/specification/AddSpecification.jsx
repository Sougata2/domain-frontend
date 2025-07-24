import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function AddSpecification() {
  const defaultValues = {
    name: "",
    price: "",
  };
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  async function handleOnSubmit(data) {
    try {
      const response = await axios.post("/specification", data);
      const _ = response.data;
      reset(defaultValues);
      toast.success("Success", { description: "Added Specification" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="flex flex-col gap-3 w-md"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div>
          <FormInput
            label={"Specification Name"}
            name={"name"}
            register={register}
            error={errors.name}
            validation={{
              required: {
                value: true,
                message: "Specification name is required",
              },
            }}
          />
        </div>
        <div>
          <FormInput
            label={"Price"}
            name={"price"}
            register={register}
            error={errors.price}
            validation={{
              required: {
                value: true,
                message: "Price of Specification is required",
              },
              min: {
                value: 0,
                message: "price less than 0 is not allowed",
              },
            }}
            type={"number"}
            step={"0.01"}
          />
        </div>
        <div>
          <Button>Add</Button>
        </div>
      </form>
    </div>
  );
}

export default AddSpecification;
