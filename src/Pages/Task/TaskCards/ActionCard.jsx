import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormTextarea from "@/DomainComponents/FormComponents/FormTextarea";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import axios from "axios";

const defaultValues = {
  application: "",
  workFlowAction: "",
  assignee: "",
  assigner: "",
  comments: "",
};

function ActionCard({ referenceNumber }) {
  const navigate = useNavigate();
  const { id: assignerId } = useSelector((state) => state.user);

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const action = watch("workFlowAction");

  const [actionOptions, setActionOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const fetchActions = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setActionOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const fetchAssignees = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/assignee-list-for-action/${
          action.value.id
        }/${referenceNumber}?regressive=${
          action?.value?.movement === "REGRESSIVE"
        }`
      );

      const data = response.data;
      if (action?.value?.movement === "PROGRESSIVE") {
        setAssigneeOptions(
          data.map((d) => ({
            label: d.email,
            value: d,
          }))
        );
      } else if (action?.value?.movement === "PROGRESSIVE_ONE") {
        setValue("assignee", { label: data[0].email, value: data[0] });
      } else {
        setValue("assignee", { label: data[0].email, value: data[0] });
      }
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [action, referenceNumber, setValue]);

  useEffect(() => {
    (async () => {
      await fetchActions();
    })();
  }, [fetchActions]);

  useEffect(() => {
    if (action) {
      (async () => {
        await fetchAssignees();
      })();
    }
  }, [action, fetchAssignees]);

  async function handleOnSubmit(data) {
    try {
      const payload = {
        ...data,
        application: { referenceNumber },
        workFlowAction: { id: data.workFlowAction.value.id },
        assigner: { id: assignerId },
        assignee: { id: data.assignee.value.id },
      };
      const _ = await axios.post("/application/do-next", payload);
      toast.success("Success", { description: "Task Submitted" });
      navigate("/assignee-list");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <div className="grid grid-cols-2 gap-10">
        <FormSelect
          control={control}
          label={"Action"}
          name={"workFlowAction"}
          error={errors.workFlowAction}
          validations={{
            required: {
              value: true,
              message: "Action is required",
            },
          }}
          options={actionOptions}
        />
        <FormSelect
          control={control}
          label={"Assign To"}
          name={"assignee"}
          error={errors.assignee}
          isDisabled={action?.value?.movement !== "PROGRESSIVE"}
          validations={{
            required: {
              value: true,
              message: "Assignee is required",
            },
          }}
          options={assigneeOptions}
        />
      </div>
      <FormTextarea
        register={register}
        label={"Comments"}
        name={"comments"}
        error={errors.comments}
        validation={{
          required: {
            value: false,
            message: "Comments are required.",
          },
        }}
      />
      <div className="flex justify-end">
        <Button>Submit Task</Button>
      </div>
    </form>
  );
}

export default ActionCard;
