import { useParams } from "react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

export default function EditService() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const { id: serviceId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/service/${serviceId}`);
        const data = response.data;
        reset(data);
      } catch (error) {
        toast.error("Error", { description: error.message });
      }
    })();
  }, [reset, serviceId]);

  async function handleEdit(data) {
    try {
      const { createdAt, subServices, ...payload } = data;
      const _ = await axios.put("/service", payload);
      toast.success("Success", { description: "Updated Service" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex flex-col items-center justify-center"}>
      <form
        onSubmit={handleSubmit(handleEdit)}
        className="w-md flex flex-col gap-2.5"
      >
        <FormInput
          label={"Service Name"}
          name={"name"}
          register={register}
          error={errors.name}
        />
        <Button type={"submit"} className={"w-full"}>
          Update Service
        </Button>
      </form>
    </div>
  );
}
