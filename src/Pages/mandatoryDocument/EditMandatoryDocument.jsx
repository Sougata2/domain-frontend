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
  subService: "",
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

  const [subServiceOptions, setSubServiceOptions] = useState([]);

  const fetchSubServices = useCallback(async () => {
    try {
      const response = await axios.get("/sub-service/all");
      const data = response.data;
      setSubServiceOptions(data.map((d) => ({ label: d.name, value: d })));
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
        subService: data.subService
          ? { label: data.subService?.name, value: data.form }
          : null,
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    (async () => {
      await fetchSubServices();
    })();
  }, [fetchSubServices]);

  useEffect(() => {
    (async () => {
      await fetchSavedData();
    })();
  }, [fetchSavedData]);

  async function submitHandler(data) {
    try {
      const payload = {
        ...data,
        subService: { id: data.subService.value.id },
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
            error={errors.subService}
            name={"subService"}
            label={"Select Sub Service"}
            options={subServiceOptions}
            validations={{
              required: {
                value: true,
                message: "Sub Service is required",
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
