import { Button } from "@/components/ui/button";
import FormTextarea from "@/DomainComponents/FormComponents/FormTextArea";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  name: "",
  address: "",
  email: "",
  phone: "",
};
function AddLab() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  async function handleOnSubmit(data) {
    try {
      const _ = await axios.post("/lab", data);
      reset();
      toast.success("Success", { description: "Lab Details Added" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-md">
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <FormInput
            label={"Lab Name"}
            name={"name"}
            register={register}
            error={errors.name}
            validation={{
              required: {
                value: true,
                message: "Lab Name is required",
              },
            }}
          />
          <FormTextarea
            label={"Lab Address"}
            name={"address"}
            register={register}
            error={errors.address}
            validation={{
              required: {
                value: true,
                message: "Lab Address is required",
              },
            }}
          />
          <FormInput
            label={"Lab Email"}
            name={"email"}
            register={register}
            error={errors.email}
            validation={{
              required: {
                value: true,
                message: "Lab Email is required",
              },
            }}
          />
          <FormInput
            label={"Lab Phone"}
            name={"phone"}
            register={register}
            error={errors.phone}
            validation={{
              required: {
                value: true,
                message: "Lab Phone is required",
              },
            }}
            type="tel"
          />
          <div>
            <Button>Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLab;
