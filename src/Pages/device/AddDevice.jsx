import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/DomainComponents/FormInput";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import FormSelectMulti from "@/DomainComponents/FormComponents/FormSelectMulti";

const defaultValues = {
  id: "",
  name: "",
  height: "",
  heightUnit: "",
  weight: "",
  weightUnit: "",
  length: "",
  lengthUnit: "",
  activities: [],
  specifications: [],
  application: "",
  quantity: "",
  remarks: "",
};

function AddDevice() {
  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
  });

  const { referenceNumber } = useParams();

  const selectedActivties = watch("activities");
  const selectedSpecification = watch("specifications");

  const specificationRef = useRef(null);

  const [activities, setActivities] = useState([]);
  const [specificationOptions, setSpecificationOptions] = useState([]);
  const [subService, setSubService] = useState(null);
  const [activitieOptions, setActivitieOptions] = useState([]);

  const fetchApplicationData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-reference-id/${referenceNumber}`
      );
      const data = response.data;
      setSubService(data.subService);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axios.get(
        `/activity/by-sub-service/${subService.id}`
      );
      const data = response.data;
      setActivities(data);
      setActivitieOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [subService]);

  useEffect(() => {
    (async () => {
      if (referenceNumber) {
        await fetchApplicationData();
      }
    })();
  }, [fetchApplicationData, referenceNumber]);

  useEffect(() => {
    if (subService) {
      (async () => {
        await fetchActivities();
      })();
    }
  }, [fetchActivities, subService]);

  async function handleOnSubmit(data) {
    try {
      console.log(data);
      toast.success("Success", { description: "Device Saved" });
      reset(defaultValues);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Register Device</CardTitle>
            <CardDescription>
              Register your device for Testing activity
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="flex flex-col gap-3.5"
          >
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label={"Device Name"}
                  name={"name"}
                  register={register}
                  error={errors.name}
                  validation={{
                    required: {
                      value: true,
                      message: "Device Name is required",
                    },
                  }}
                />
                <FormInput
                  label={"Device Height"}
                  name={"height"}
                  register={register}
                  error={errors.height}
                  validation={{
                    required: {
                      value: true,
                      message: "Device height is required",
                    },
                    min: {
                      value: 1,
                      message: "Heigth cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
                <FormSelect
                  control={control}
                  label={"Unit of Device Length"}
                  name={"lengthUnit"}
                  options={[
                    { label: "mm", value: "mm" },
                    { label: "cm", value: "cm" },
                    { label: "m", value: "m" },
                  ]}
                  error={errors.lengthUnit}
                  validations={{
                    required: {
                      value: true,
                      message: "Length unit is required",
                    },
                  }}
                />
                <FormInput
                  label={"Device Weight"}
                  name={"weight"}
                  register={register}
                  error={errors.weight}
                  validation={{
                    required: {
                      value: true,
                      message: "Device Weight is required",
                    },
                    min: {
                      value: 1,
                      message: "Weigth cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
                <FormSelect
                  control={control}
                  label={"Unit of Device Weigth"}
                  name={"weightUnit"}
                  options={[
                    { label: "mg", value: "mg" },
                    { label: "g", value: "g" },
                    { label: "kg", value: "kg" },
                  ]}
                  error={errors.weightUnit}
                  validations={{
                    required: {
                      value: true,
                      message: "Weigth unit is required",
                    },
                  }}
                />
                <FormInput
                  label={"Device Length"}
                  name={"length"}
                  register={register}
                  error={errors.length}
                  validation={{
                    required: {
                      value: true,
                      message: "Device Length is required",
                    },
                    min: {
                      value: 1,
                      message: "Length cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
                <FormSelect
                  control={control}
                  label={"Unit of Device Height"}
                  name={"heightUnit"}
                  options={[
                    { label: "mm", value: "mm" },
                    { label: "cm", value: "cm" },
                    { label: "m", value: "m" },
                  ]}
                  error={errors.heightUnit}
                  validations={{
                    required: {
                      value: true,
                      message: "Heigth unit is required",
                    },
                  }}
                />
                <Controller
                  name="activities"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Activities are required",
                    },
                  }}
                  render={() => (
                    <FormSelectMulti
                      name={"activities"}
                      label={"Activities"}
                      defaultValue={selectedActivties}
                      disabled={
                        activitieOptions && activitieOptions.length === 0
                      }
                      options={activitieOptions}
                      error={errors.activities}
                      handleOnChange={(e) => {
                        setValue("activities", [...e]);
                        specificationRef.current.clearValue();
                        setSpecificationOptions(() => {
                          const specs = [];
                          e.forEach((ac) =>
                            specs.push(
                              ...ac.value.specifications.map((s) => ({
                                label: s.name,
                                value: s,
                              }))
                            )
                          );
                          return specs;
                        });
                      }}
                    />
                  )}
                />
                <Controller
                  name="specifications"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Specifications are required",
                    },
                  }}
                  render={() => (
                    <FormSelectMulti
                      ref={specificationRef}
                      name={"specifications"}
                      label={"Specifications"}
                      defaultValue={selectedSpecification}
                      disabled={
                        specificationOptions &&
                        specificationOptions.length === 0
                      }
                      error={errors.specifications}
                      options={specificationOptions}
                      handleOnChange={(e) => {
                        setValue("specifications", [...e]);
                      }}
                    />
                  )}
                />
                <FormInput
                  label={"Quantity"}
                  name={"quantity"}
                  register={register}
                  error={errors.quantity}
                  validation={{
                    required: {
                      value: true,
                      message: "Quantity is required",
                    },
                    min: {
                      value: 1,
                      message: "Quantity cannot be less than 1",
                    },
                  }}
                  type={"number"}
                />
              </div>
            </CardContent>
            <CardFooter className={"flex justify-end gap-2"}>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset(defaultValues);
                }}
              >
                Reset
              </Button>
              <Button>Save</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default AddDevice;
