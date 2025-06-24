import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import FormSelect from "@/DomainComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddSubService() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [forms, setForms] = useState([]);

  const fetchForms = useCallback(async () => {
    try {
      const response = await axios.get("/form/all");
      setForms(
        response.data.map((form) => ({ label: form.name, value: form }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchForms();
    })();
  }, [fetchForms]);

  async function submitHandler(data) {
    try {
      console.log(data);
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
        <FormSelect
          label={"Form"}
          name={"form"}
          register={register}
          error={errors.form}
          validation={{
            required: { value: true, message: "Form is Required" },
          }}
          options={forms}
        />
        <Button className={"w-full"}>Add Sub Service</Button>
      </form>
    </div>
  );
}
