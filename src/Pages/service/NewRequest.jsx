import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormSelect from "@/DomainComponents/Form/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function NewRequest() {
  const defaultValues = {
    user: {},
    service: {},
    subService: {},
    status: {},
  };

  const { id: userId } = useSelector((state) => state.user);
  const {
    reset,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues,
  });

  const service = watch("service");

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("/service/all");
      const data = response.data;
      setServices(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchServices();
    })();
  }, [fetchServices]);

  useEffect(() => {
    if (service) {
      const serviceObject = services.find((s) => s.id === service);
      setSubServices(serviceObject?.subServices);
    }
  }, [service, services]);

  async function submitHandler(data) {
    try {
      const payload = {
        service: { id: data.service },
        subService: { id: data.subService },
        user: { id: userId },
        status: { id: 1 },
      };
      const _ = await axios.post("/application", payload);
      toast.success("Success", { description: "Application Generated" });
      reset(defaultValues);
    } catch (error) {
      console.log(error);
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <Card className={"w-3xl"}>
        <CardHeader>
          <CardTitle>Service Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className={"flex justify-between flex-col gap-3 w-full"}
          >
            <div className="grid grid-cols-2 gap-5">
              <FormSelect
                label={"Service"}
                name={"service"}
                control={control}
                error={errors.service}
                options={services}
                validation={{
                  required: { value: true, message: "Service is required" },
                }}
                className="w-full"
              />
              <FormSelect
                label={"SubService"}
                name={"subService"}
                control={control}
                error={errors.subService}
                options={subServices}
                validation={{
                  required: { value: true, message: "Sub Service is required" },
                }}
                className="w-full"
              />
            </div>
            <div className="flex justify-end">
              <Button>Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
