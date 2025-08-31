import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  name: "",
};

function AddWorkFlowActionGroup() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  async function submitOnHandle(data) {
    try {
      await axios.post("/workflow-group", data);
      reset(defaultValues);
      toast.success("Success", { description: "Group added" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="w-md flex flex-col gap-2.5"
        onSubmit={handleSubmit(submitOnHandle)}
      >
        <FormInput
          register={register}
          name={"name"}
          label={"Group Name"}
          error={errors.name}
          validation={{
            required: {
              value: true,
              message: "Group Name is required",
            },
          }}
        />
        <div>
          <Button>Add Group</Button>
        </div>
      </form>
    </div>
  );
}

export default AddWorkFlowActionGroup;
