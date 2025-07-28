import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import FormSelect from "@/DomainComponents/FormSelect";
import useMenu from "@/hooks/use-menu";
import axios from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function RegisterFormStages() {
  const defaultValues = {
    id: "",
    menu: "",
    stageOrder: "",
    forms: "",
  };

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const fetchMenus = useCallback(async () => {
    try {
      const response = await axios.get("/menu");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  function handleOnSubmit(data) {
    console.log(data);
  }

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="flex flex-col gap-2 w-md">
          <div>
            <FormSelect
              control={control}
              error={errors.menu}
              defaultValue={null}
              label={"Menu"}
              name={"menu"}
              options={[
                { label: "a", value: "A" },
                { label: "b", value: "B" },
              ]}
              validation={{
                required: {
                  value: true,
                  message: "Menu is Required",
                },
              }}
            />
          </div>
          <div>
            <FormInput
              register={register}
              label={"Stage order"}
              name={"stageOrder"}
              error={errors.stageOrder}
              validation={{
                required: {
                  value: true,
                  message: "Stage Order is required",
                },
              }}
              type={"number"}
            />
          </div>
          <div>
            <Button>Save</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterFormStages;
