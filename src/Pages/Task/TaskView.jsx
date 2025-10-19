import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FaRegFolderOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ApplicationHistory from "./components/ApplicationHistory";
import TaskCardProvider from "./TaskCards/TaskCardProvider";
import TaskDetails from "./TaskDetails";
import axios from "axios";

function TaskView() {
  const { referenceNumber } = useParams();
  const { id: assignerId } = useSelector((state) => state.user);

  const [openDetails, setOpenDetails] = useState(true);
  const [applicationData, setApplicationData] = useState("");

  const fetchApplication = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-reference-id/${referenceNumber}`
      );
      setApplicationData(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchApplication();
    })();
  }, [fetchApplication]);

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
            {openDetails && <TaskDetails applicationData={applicationData} />}
          </CardContent>
        </Card>
        {/* ===============History Table======================= */}
        <ApplicationHistory referenceNumber={referenceNumber} />
        {/* ===============History Table======================= */}
        {applicationData?.assignee?.id === assignerId && (
          <Card>
            <CardHeader>
              <CardTitle>Task Action</CardTitle>
              <CardDescription>
                take action for this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskCardProvider
                referenceNumber={referenceNumber}
                actionType={applicationData.status.actionType}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TaskView;
