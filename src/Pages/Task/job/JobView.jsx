import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import PreviewDataBody from "@/DomainComponents/PreviewDataBody";
import PreviewDataCell from "@/DomainComponents/PreviewDataCell";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import TaskCardProvider from "../TaskCards/TaskCardProvider";

function JobView() {
  const { id } = useParams();
  const { id: assignerId } = useSelector((state) => state.user);
  const [jobDetails, setJobDetails] = useState("");
  const [deviceDetails, setDeviceDetails] = useState("");

  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/job/${id}`);
      const data = response.data;
      setJobDetails(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id]);

  const fetchDeviceDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/device/${jobDetails.device.id}`);
      const data = response.data;
      setDeviceDetails(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [jobDetails]);

  useEffect(() => {
    (async () => {
      await fetchJobDetails();
    })();
  }, [fetchJobDetails]);

  useEffect(() => {
    if (jobDetails) {
      (async () => {
        await fetchDeviceDetails();
      })();
    }
  }, [fetchDeviceDetails, jobDetails]);

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <Card className={"w-3xl"}>
        <CardHeader>
          <CardTitle>Device Details</CardTitle>
          <CardDescription>device details for this job</CardDescription>
        </CardHeader>
        <CardContent>
          <PreviewDataBody>
            <PreviewDataCell label={"Device Name"} value={deviceDetails.name} />
            <PreviewDataCell
              label={"Height"}
              value={`${deviceDetails.height} ${deviceDetails.heightUnit}`}
            />
            <PreviewDataCell
              label={"Weight"}
              value={`${deviceDetails.weight} ${deviceDetails.weightUnit}`}
            />
            <PreviewDataCell
              label={"Length"}
              value={`${deviceDetails.length} ${deviceDetails.lengthUnit}`}
            />
            <PreviewDataCell
              label={"Quantity"}
              value={deviceDetails.quantity}
            />
            <PreviewDataCell
              label={"Activities"}
              value={
                <div className="flex gap-1.5">
                  {deviceDetails.activities?.map((a) => (
                    <Badge key={a.id}>{a.name}</Badge>
                  ))}
                </div>
              }
            />
            <PreviewDataCell
              label={"Specifications"}
              value={
                <div className="flex gap-1.5">
                  {deviceDetails.specifications?.map((s) => (
                    <Badge key={s.id}>{s.name}</Badge>
                  ))}
                </div>
              }
            />
          </PreviewDataBody>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      {jobDetails.assignee?.id === assignerId && (
        <Card className={"w-3xl"}>
          <CardHeader>
            <CardTitle>Task Action</CardTitle>
            <CardDescription>take action for this application</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskCardProvider
              jobId={jobDetails.id}
              actionType={jobDetails.status.actionType}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default JobView;
