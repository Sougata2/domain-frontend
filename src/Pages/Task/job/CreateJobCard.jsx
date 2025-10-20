import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCallback, useEffect, useState } from "react";
import { VscCircleSlash } from "react-icons/vsc";
import { FaArrowRight } from "react-icons/fa6";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import PreviewDataBody from "@/DomainComponents/PreviewDataBody";
import PreviewDataCell from "@/DomainComponents/PreviewDataCell";
import DataTable from "@/DomainComponents/DataTable";
import axios from "axios";
import ActionCard from "../TaskCards/ActionCard";

export function Confirm({ handleConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>Generate</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will create job card for this
            device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CreateJobCard({ referenceNumber }) {
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
            Device Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "job",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Job Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            <Badge variant={"secondary"}>
              {row.getValue("job").status?.postDescription ?? (
                <div>
                  <VscCircleSlash size={17} />
                </div>
              )}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "jobUpdatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Updated At
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3">
            {row.getValue("jobUpdatedAt") &&
              format(new Date(row.getValue("jobUpdatedAt")), "dd-MM-yyyy")}
            {!row.getValue("jobUpdatedAt") && <VscCircleSlash size={17} />}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => {
        return <div>Action</div>;
      },
      cell: ({ row }) => {
        const { original } = row;
        return (
          <div>
            {deviceJobMap[row.getValue("id")] !== null && (
              <div>
                {!["JCG"].includes(
                  deviceJobMap[row.getValue("id")]?.status?.name
                ) && <VscCircleSlash size={17} />}
              </div>
            )}
            {!deviceJobMap[row.getValue("id")] && (
              <Confirm handleConfirm={() => handleCreateJobCard(original)} />
            )}
            {deviceJobMap[row.getValue("id")]?.status?.name === "JCG" && (
              <Button
                variant={"outline"}
                onClick={() => handleDoNext(original)}
              >
                Proceed For Testing
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const [jobFlowCompleted, setJobFlowCompleted] = useState(false);
  const [applicationData, setApplicationData] = useState("");
  const [deviceJobMap, setDeviceJobMap] = useState("");
  const [devices, setDevices] = useState([]);
  const [jobs, setJobs] = useState([]);

  const fetchApplicationData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-reference-id/${referenceNumber}`
      );
      const data = response.data;
      setApplicationData(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(
        `/device/by-application-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setDevices(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get(
        `/job/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setJobs(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const mapDeviceToJob = useCallback(() => {
    try {
      const map = {};
      if (devices && jobs) {
        devices.forEach((device) => {
          map[device.id] = null;
        });
        jobs.forEach((job) => {
          map[job.device.id] = job;
        });
      }
      setDeviceJobMap(map);
    } catch (error) {
      toast.error(error.message);
    }
  }, [devices, jobs]);

  useEffect(() => {
    (async () => {
      await fetchJobs();
    })();
  }, [fetchJobs]);

  useEffect(() => {
    (async () => {
      await fetchApplicationData();
      await fetchDevices();
    })();
  }, [fetchApplicationData, fetchDevices]);

  useEffect(() => {
    mapDeviceToJob();
  }, [mapDeviceToJob]);

  useEffect(() => {
    const arr = Object.keys(deviceJobMap).map((k) => {
      const key = Number(k);
      if (deviceJobMap[key]) {
        return deviceJobMap[key].status.isFinal;
      }
      return false;
    });

    if (arr.length > 0) setJobFlowCompleted(arr.every((v) => v === true));
  }, [deviceJobMap]);

  async function handleCreateJobCard(device) {
    try {
      const payload = {
        device: { id: device.id },
        status: { name: "JCG" },
        assignee: { id: applicationData.assignee.id },
        lab: { id: applicationData.lab.id },
      };

      const _ = await axios.post("/job", payload);
      toast.success("Success", { description: "Job Created Successfully" });
      await fetchDevices();
      await fetchJobs();
      mapDeviceToJob();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleDoNext(device) {
    try {
      const response = await axios.get(
        `/workflow-action/by-job-id/${device.job.id}`
      );
      const actions = response.data;

      const payload = {
        job: { id: device.job.id },
        workFlowAction: { id: actions[0].id },
        assigner: { id: applicationData.assignee.id },
      };

      await axios.post(`/job/do-next`, payload);
      toast.success("Success", { description: "Task Submitted Successfully" });
      await fetchDevices();
      await fetchJobs();
      mapDeviceToJob();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <div className="w-full">
        <DataTable
          columns={columns}
          data={devices.map((d) => {
            const {
              device: _ = {},
              updatedAt = null,
              ...rest
            } = deviceJobMap[d.id] || {};
            return { ...d, jobUpdatedAt: updatedAt, job: { ...rest } };
          })}
          options={{ searchField: "name" }}
        />
        {jobFlowCompleted && (
          <div>
            <ActionCard referenceNumber={referenceNumber} />
          </div>
        )}
      </div>
      {
        !devices.map((device) => (
          <Card key={device.id} className={"w-full"}>
            <CardHeader>
              <CardTitle>Job Card</CardTitle>
              <CardDescription>create job card for this device</CardDescription>
              <CardAction>
                {device.job === null && (
                  <Confirm handleConfirm={() => handleCreateJobCard(device)} />
                )}
                {device.job !== null && (
                  <Badge variant={"secondary"}>Job Generated</Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <PreviewDataBody>
                <PreviewDataCell label={"Device Name"} value={device.name} />
                <PreviewDataCell
                  label={"Device Height"}
                  value={`${device.height} ${device.heightUnit}`}
                />
                <PreviewDataCell
                  label={"Device Weight"}
                  value={`${device.weight} ${device.weightUnit}`}
                />
                <PreviewDataCell
                  label={"Device Length"}
                  value={`${device.length} ${device.lengthUnit}`}
                />
                <PreviewDataCell label={"Quantity"} value={device.quantity} />
                <PreviewDataCell
                  label={"Activities"}
                  value={
                    <div className="flex gap-2">
                      {device.activities.map((a) => (
                        <Badge key={a.name}>{a.name}</Badge>
                      ))}
                    </div>
                  }
                />
                <PreviewDataCell
                  label={"Specifications"}
                  value={
                    <div className="flex gap-2">
                      {device.specifications.map((s) => (
                        <Badge key={s.name}>{s.name}</Badge>
                      ))}
                    </div>
                  }
                />
              </PreviewDataBody>
            </CardContent>
            <CardFooter className={"flex justify-end"}>
              {device.job !== null && (
                <div>
                  {deviceJobMap[device.id]?.status.name !== "JCG" && (
                    <div>
                      <Button disabled={true} className="capitalize">
                        {deviceJobMap[device.id]?.status.postDescription}
                      </Button>
                    </div>
                  )}
                  {deviceJobMap[device.id]?.status.name === "JCG" && (
                    <div
                      onClick={() => handleDoNext(device)}
                      className="flex items-center gap-3 group bg-primary hover:bg-primary/90 text-white rounded-md py-2 px-3 cursor-pointer"
                    >
                      <div>Proceed For Testing</div>
                      <div>
                        <FaArrowRight
                          size={20}
                          className="mt-[3px] font-bold transform transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))
      }
    </div>
  );
}

export default CreateJobCard;
