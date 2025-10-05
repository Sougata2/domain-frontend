import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { GrDocumentTest } from "react-icons/gr";
import { ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormFileInput from "@/DomainComponents/FormComponents/FormFileInput";
import FormTextarea from "@/DomainComponents/FormComponents/FormTextarea";
import FormSelect from "@/DomainComponents/FormComponents/FormSelect";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";

const defaultValues = {
  workFlowAction: "",
  assignee: "",
  assigner: "",
  comments: "",
  file: "",
};

function TestReportValidateCard({ jobId }) {
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
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Test Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "recordCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Test Record Count
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("recordCount")}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        const link = `/lab-test-entry/${jobId}/${row.getValue("id")}?view=true`;
        return (
          <Link to={link}>
            <GrDocumentTest size={17} />
          </Link>
        );
      },
    },
  ];
  const [templates, setTemplates] = useState([]);
  const [workFlowActionOption, setWorkFlowActionOption] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const action = watch("workFlowAction");

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await axios.get(`/lab-test-template/by-job-id/${jobId}`);
      const data = response.data;
      setTemplates(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [jobId]);

  const fetchRecordCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `/lab-test-record/get-record-count/${jobId}`
      );
      const data = response.data;
      setTemplates((prevState) => {
        return prevState.map((t) => ({
          ...t,
          recordCount: Number(data[t.id] ?? 0),
        }));
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [jobId]);

  const fetchWorkFlowAction = useCallback(async () => {
    try {
      const response = await axios.get(`/workflow-action/by-job-id/${jobId}`);
      const data = response.data;
      setWorkFlowActionOption(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [jobId]);

  const fetchAssignees = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/assignee-list-for-action?action=${action.value.id}&job=${jobId}`
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
  }, [action, jobId, setValue]);

  useEffect(() => {
    (async () => {
      await fetchTemplates();
      await fetchRecordCount();
      await fetchWorkFlowAction();
    })();
  }, [fetchRecordCount, fetchTemplates, fetchWorkFlowAction]);

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
        job: { id: jobId },
        workFlowAction: { id: data.workFlowAction.value.id },
        assigner: { id: assignerId },
        assignee: { id: data.assignee.value.id },
      };

      if (payload.file.length > 0) {
        const file = payload.file[0];
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadResponseData = uploadResponse.data;
        if (uploadResponseData) {
          payload.file = { id: uploadResponseData.id };
        } else {
          payload.file = null;
          throw new Error(
            "Something went wrong, document could not be uploaded"
          );
        }
      } else {
        payload.file = null;
      }

      await axios.post("/job/do-next", payload);
      toast.success("Success", { description: "Task Submitted" });
      navigate("/job-list");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex justify-between">
          <div className="text-xl font-bold">Test Report</div>
        </div>
        <div className="w-full">
          <DataTable
            columns={columns}
            data={templates}
            options={{ searchField: "name" }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Action</div>
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <div className="flex flex-col gap-3">
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
                options={workFlowActionOption}
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

            <div>
              <FormFileInput
                register={register}
                error={errors.file}
                label={"Upload Document"}
                name={"file"}
                validation={{
                  required: {
                    value: false,
                    message: "Document is required",
                  },
                }}
              />
            </div>
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
      </div>
    </div>
  );
}

export default TestReportValidateCard;
