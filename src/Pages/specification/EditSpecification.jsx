import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo } from "react";

function EditSpecification() {
  const defaultValues = useMemo(() => {
    return {
      id: "",
      name: "",
      price: "",
    };
  }, []);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  const { id: specificationId } = useParams();

  const fetchSpecification = useCallback(async () => {
    try {
      const response = await axios.get(`/specification/${specificationId}`);
      const data = response.data;
      reset({
        ...defaultValues,
        id: data.id,
        name: data.name,
        price: data.price,
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [defaultValues, reset, specificationId]);

  useEffect(() => {
    (async () => {
      await fetchSpecification();
    })();
  }, [fetchSpecification]);

  async function handleOnSubmit(data) {
    try {
      const _ = await axios.put("/specification", data);
      toast.success("Success", {
        description: "Specification Updated successfully",
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="flex flex-col gap-3 w-md"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div>
          <FormInput
            label={"Specification Name"}
            name={"name"}
            register={register}
            error={errors.name}
            validation={{
              required: {
                value: true,
                message: "Specification name is required",
              },
            }}
          />
        </div>
        <div>
          <FormInput
            label={"Price"}
            name={"price"}
            register={register}
            error={errors.price}
            validation={{
              required: {
                value: true,
                message: "Price of Specification is required",
              },
              min: {
                value: 0,
                message: "price less than 0 is not allowed",
              },
            }}
            type={"number"}
            step={"0.01"}
          />
        </div>
        <div>
          <Button>Save</Button>
        </div>
      </form>
    </div>
  );
}

export default EditSpecification;
