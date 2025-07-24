import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo } from "react";

function EditActivity() {
  const defaultValues = useMemo(() => {
    return {
      id: "",
      name: "",
    };
  }, []);

  const { id: activityId } = useParams();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const fetchActivity = useCallback(async () => {
    try {
      const response = await axios.get(`/activity/${activityId}`);
      const data = response.data;
      reset({ ...defaultValues, id: data.id, name: data.name });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [activityId, defaultValues, reset]);

  useEffect(() => {
    (async () => {
      await fetchActivity();
    })();
  }, [fetchActivity]);

  async function onSubmitHandleSubmit(data) {
    try {
      const _ = await axios.put("/activity", data);
      toast.success("Success", {
        description: "Activity Updated successfully",
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Card className={"w-md"}>
        <CardHeader>
          <CardTitle>Edit Activity</CardTitle>
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
            <Button>Save</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditActivity;
