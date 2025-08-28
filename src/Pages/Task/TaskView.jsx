import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FaRegFolderOpen } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import TaskDetails from "./TaskDetails";
import FormTextarea from "@/DomainComponents/FormComponents/FormTextarea";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

const defaultValues = {
  application: "",
  workFlowAction: "",
  assignee: "",
  assigner: "",
  comments: "",
};

function TaskView() {
  const navigate = useNavigate();
  const { referenceNumber } = useParams();
  const { id: assignerId } = useSelector((state) => state.user);
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const action = watch("workFlowAction");

  const [openDetails, setOpenDetails] = useState(false);
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
    <div className="flex justify-center items-center">
      <div className="min-w-3xl  max-w-5xl flex flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Application ({referenceNumber})</CardTitle>
            <CardDescription>application details</CardDescription>
            <CardAction>
              <Button
                variant={"ghost"}
                onClick={() => setOpenDetails((prev) => !prev)}
              >
                {!openDetails ? (
                  <FaRegFolderOpen size={60} />
                ) : (
                  <FaRegFolderClosed />
                )}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {openDetails && <TaskDetails referenceNumber={referenceNumber} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Action</CardTitle>
            <CardDescription>take action for this application</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TaskView;
