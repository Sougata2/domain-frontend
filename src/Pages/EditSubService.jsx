import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormSelect from "@/DomainComponents/FormSelect";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

export default function EditSubService() {
  const {
    control,
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [forms, setForms] = useState([]);
  const { id: subServiceId } = useParams();

  const { form } = getValues();

  const fetchSubService = useCallback(async () => {
    try {
      const response = await axios.get(`/sub-service/${subServiceId}`);
      reset(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [reset, subServiceId]);

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
      if (subServiceId) await fetchSubService();
      await fetchForms();
    })();
  }, [fetchForms, fetchSubService, subServiceId]);

  async function submitHandler(data) {
    try {
      const response = await axios.post("/sub-service", data);
      toast.success("Success", { description: "Created Sub Service" });
      reset({
        name: "",
        form: null,
      });
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
          error={errors.form}
          validation={{
            required: { value: true, message: "Form is Required" },
          }}
          options={forms}
          control={control}
          defaultValue={form}
        />
        <Button className={"w-full"}>Add Sub Service</Button>
      </form>
    </div>
  );
}
