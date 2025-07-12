import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { toast } from "sonner";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";

export default function EditStatus() {
  const defaultValues = {
    name: "",
    description: "",
  };

  const { id: statusId } = useParams();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const fetchStatusById = useCallback(async () => {
    try {
      const response = await axios.get(`/status/${statusId}`);
      const data = response.data;
      reset(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [reset, statusId]);

  useEffect(() => {
    (async () => {
      await fetchStatusById();
    })();
  }, [fetchStatusById]);

  async function submitHandler(payload) {
    try {
      const response = await axios.put("/status", payload);
      const data = response.data;

      toast.success("Success", {
        description: `Status ${data.name} Updated`,
      });
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
          <Button>Update</Button>
        </div>
      </form>
    </div>
  );
}
