import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultValues = {
  name: "",
  form: "",
};

function AddMandatoryDocument() {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [formOptions, setFormOptions] = useState([]);

  const fetchForms = useCallback(async () => {
    try {
      const response = await axios.get("/form/all");
      const data = response.data;
      setFormOptions(data.map((d) => ({ label: d.name, value: d })));
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
      const payload = {
        ...data,
        form: { id: data.form.value.id },
      };
      const response = await axios.post("/mandatory-document", payload);
      reset(defaultValues);
      toast.success("Success", { description: "Manadatory Document Added" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="flex flex-col gap-2 w-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="flex flex-col gap-1.5">
          <FormInput
            register={register}
            label={"Name"}
            name={"name"}
            error={errors.name}
            validation={{
              required: {
                value: true,
                message: "Document Name is required",
              },
            }}
          />
          <FormSelect
            control={control}
            error={errors.form}
            name={"form"}
            label={"Select Form"}
            options={formOptions}
            validations={{
              required: {
                value: true,
                message: "Form is required",
              },
            }}
          />
        </div>
        <div>
          <Button>Add</Button>
        </div>
      </form>
    </div>
  );
}

export default AddMandatoryDocument;
