import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { VscCircleSlash } from "react-icons/vsc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import Download from "@/DomainComponents/Download";
import axios from "axios";

function ViewComments({ comments, author }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">view</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription className={"py-3 font-mono"}>
            {comments}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"text-sm font-extralight"}>
          by {author}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApplicationHistory({ referenceNumber }) {
  const [workflowHistory, setWorkFlowHistory] = useState([]);

  const fetchWorkFlowHistory = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-history/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setWorkFlowHistory(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchWorkFlowHistory();
    })();
  }, [fetchWorkFlowHistory]);

  if (!workflowHistory.length) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application History</CardTitle>
        <CardDescription>
          list of all actions taken upon the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Assigner</th>
              <th>Action</th>
              <th>Assignee</th>
              <th>Comments</th>
              <th>document</th>
            </tr>
          </thead>
          <tbody>
            {workflowHistory.map((h, i) => (
              <tr key={h.id}>
                <td>{i + 1}</td>
                <td className="capitalize">{`${h.assigner.firstName} ${h.assigner.lastName}`}</td>
                <td>
                  <Badge variant={"secondary"}>
                    {h.status.postDescription}
                  </Badge>
                </td>
                <td className="capitalize">{`${h.assignee.firstName} ${h.assignee.lastName}`}</td>
                <td>
                  <div className="flex justify-center">
                    {h.comments ? (
                      <ViewComments
                        comments={h.comments}
                        author={`${h.assigner.firstName} ${h.assigner.lastName}`}
                      />
                    ) : (
                      <VscCircleSlash className="text-slate-500" />
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex justify-center">
                    {h.file ? (
                      <Download fileId={h.file.id} />
                    ) : (
                      <VscCircleSlash className="text-slate-500" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default ApplicationHistory;
