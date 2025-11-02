import { useCallback, useEffect } from "react";
import { useParams } from "react-router";
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

function EditComponent() {
  const { id } = useParams();

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const fetchComponent = useCallback(async () => {
    try {
      const response = await axios.get(`/view-component/${id}`);
      const data = response.data;
      reset({
        ...data,
        applicationType: {
          label: data.applicationType,
          value: data.applicationType,
        },
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    (async () => {
      await fetchComponent();
    })();
  }, [fetchComponent]);

  async function handleOnSubmit(data) {
    try {
      const payload = { ...data, applicationType: data.applicationType.value };
      await axios.put("/view-component", payload);
      toast.info("Success", { description: "Component Updated Successfully" });
      await fetchComponent();
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
          <Button>Save</Button>
        </div>
      </form>
    </div>
  );
}

export default EditComponent;
