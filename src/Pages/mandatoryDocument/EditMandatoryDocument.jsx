import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultValues = {
  name: "",
  form: "",
};

function EditMandatoryDocument() {
  const { id } = useParams();
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

  const fetchSavedData = useCallback(async () => {
    try {
      const response = await axios.get(`/mandatory-document/${id}`);
      const data = response.data;
      reset({
        ...data,
        form: { label: data.form.name, value: data.form },
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    (async () => {
      await fetchForms();
    })();
  }, [fetchForms]);

  useEffect(() => {
    (async () => {
      await fetchSavedData();
    })();
  }, [fetchSavedData]);

  async function submitHandler(data) {
    try {
      const payload = {
        ...data,
        form: { id: data.form.value.id },
      };
      const _ = await axios.put("/mandatory-document", payload);
      await fetchSavedData();
      toast.info("Update", { description: "Manadatory Document Updated" });
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
          <Button>Save</Button>
        </div>
      </form>
    </div>
  );
}

export default EditMandatoryDocument;
