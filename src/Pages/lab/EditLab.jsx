import { Button } from "@/components/ui/button";
import FormTextarea from "@/DomainComponents/FormComponents/FormTextArea";
import FormInput from "@/DomainComponents/FormInput";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";

const defaultValues = {
  id: "",
  name: "",
  address: "",
  email: "",
  phone: "",
};
function EditLab() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { id } = useParams();

  const fetchLabDetail = useCallback(async () => {
    try {
      const response = await axios.get(`/lab/${id}`);
      const data = response.data;
      reset(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    if (id) {
      (async () => {
        await fetchLabDetail();
      })();
    }
  }, [fetchLabDetail, id]);

  async function handleOnSubmit(data) {
    try {
      const _ = await axios.put("/lab", data);
      await fetchLabDetail();
      toast.success("Success", { description: "Lab Detail Updated" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-md">
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <FormInput
            label={"Lab Name"}
            name={"name"}
            register={register}
            error={errors.name}
            validation={{
              required: {
                value: true,
                message: "Lab Name is required",
              },
            }}
          />
          <FormTextarea
            label={"Lab Address"}
            name={"address"}
            register={register}
            error={errors.address}
            validation={{
              required: {
                value: true,
                message: "Lab Address is required",
              },
            }}
          />
          <FormInput
            label={"Lab Email"}
            name={"email"}
            register={register}
            error={errors.email}
            validation={{
              required: {
                value: true,
                message: "Lab Email is required",
              },
            }}
          />
          <FormInput
            label={"Lab Phone"}
            name={"phone"}
            register={register}
            error={errors.phone}
            validation={{
              required: {
                value: true,
                message: "Lab Phone is required",
              },
            }}
            type="tel"
          />
          <div>
            <Button>Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLab;
