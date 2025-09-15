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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import PreviewDataBody from "@/DomainComponents/PreviewDataBody";
import PreviewDataCell from "@/DomainComponents/PreviewDataCell";
import axios from "axios";

export function Confirm({ handleConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"link"}>Generate</Button>
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

function CreateJobCard({ referenceNumber, applicationData }) {
  const [devices, setDevices] = useState([]);

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

  useEffect(() => {
    (async () => {
      await fetchDevices();
    })();
  }, [fetchDevices]);

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
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      {devices.map((device) => (
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
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default CreateJobCard;
