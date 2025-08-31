import { Button } from "@/components/ui/button";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  subService: "",
  workFlowGroup: "",
};

function MapSubServiceToWorkFlowGroup() {
  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [subServiceOptions, setSubServiceOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState({});
  const subService = watch("subService");

  const fetchSubServices = useCallback(async () => {
    try {
      const response = await axios.get("/sub-service/all");
      const data = response.data;
      setSubServiceOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get(`/workflow-group/all`);
      const data = response.data;
      setGroupOptions(
        data
          .filter((d) => d.id !== subService?.value?.workFlowGroup?.id)
          .map((d) => ({ label: d.name, value: d }))
      );
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [subService]);

  useEffect(() => {
    (async () => {
      await fetchSubServices();
      if (subService) {
        await fetchGroups();
      }
    })();
  }, [fetchGroups, fetchSubServices, subService]);

  async function handleOnSubmit(data) {
    try {
      const payload = {
        id: data.subService.value.id,
        workFlowGroup: { id: data.workFlowGroup.value.id },
      };
      const _ = await axios.put("/sub-service", payload);
      toast.success("Success", { description: "Sub Service Mapped to Group" });
      reset(defaultValues);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="flex flex-col gap-2.5 min-w-3xl"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <FormSelect
          control={control}
          label={"Sub Service"}
          name={"subService"}
          options={subServiceOptions}
          validations={{
            required: {
              value: true,
              message: "Sub Service is required",
            },
          }}
          error={errors.subService}
        />
        <FormSelect
          control={control}
          isDisabled={!subService}
          label={"Work Flow Group"}
          name={"workFlowGroup"}
          options={groupOptions}
          validations={{
            required: {
              value: true,
              message: "Group is required is required",
            },
          }}
          error={errors.workFlowGroup}
        />
        <div>
          <Button>Save</Button>
        </div>
      </form>
    </div>
  );
}

export default MapSubServiceToWorkFlowGroup;
