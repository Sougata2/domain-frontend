import { useForm } from "react-hook-form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { toast } from "sonner";
import axios from "axios";

function AddActivity() {
  const defaultValues = {
    name: "",
  };
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  async function onSubmitHandleSubmit(data) {
    try {
      const response = await axios.post("/activity", data);
      console.log(response.data);
      toast.success("Success", { description: "Activity added successfully" });
      reset();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Card className={"w-md"}>
        <CardHeader>
          <CardTitle>Add Activity</CardTitle>
          <CardDescription>add test activity</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmitHandleSubmit)}>
          <CardContent className={"pb-5"}>
            <FormInput
              register={register}
              label={"Name"}
              name={"name"}
              error={errors.name}
              validation={{
                required: {
                  value: true,
                  message: "activity name is required",
                },
              }}
            />
          </CardContent>
          <CardFooter>
            <Button>Add</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AddActivity;
