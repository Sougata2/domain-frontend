import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router";
import TaskDetails from "./TaskDetails";
import { FaRegFolderOpen } from "react-icons/fa";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function TaskView() {
  const { referenceNumber } = useParams();
  const [openDetails, setOpenDetails] = useState(false);

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
          <CardContent>YOUR TASK FORM</CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TaskView;
