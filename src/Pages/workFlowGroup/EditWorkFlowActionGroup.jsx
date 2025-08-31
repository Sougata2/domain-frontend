import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";

const defaultValues = {
  name: "",
};
function EditWorkFlowActionGroup() {
  const { id } = useParams();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const fetchGroup = useCallback(async () => {
    try {
      const response = await axios.get(`/workflow-group/${id}`);
      const data = response.data;
      reset({ ...data });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    (async () => {
      await fetchGroup();
    })();
  }, [fetchGroup]);

  async function submitOnHandle(data) {
    try {
      const _ = await axios.put("/workflow-group", {
        id: data.id,
        name: data.name,
      });
      toast.info("Success", { description: "Group updated successfully" });
      await fetchGroup();
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
          <Button>Update Group</Button>
        </div>
      </form>
    </div>
  );
}

export default EditWorkFlowActionGroup;
