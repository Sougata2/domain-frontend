import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function PaymentCard({ referenceNumber }) {
  const [workFlowActionData, setWorkFlowActionData] = useState("");
  const [applicationData, setApplicationData] = useState("");
  const { id } = useSelector((state) => state.user);
  const navigate = useNavigate();

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

  const fetchWorkFlowAction = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setWorkFlowActionData(data[0]);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchApplicationData();
    })();
  }, [fetchApplicationData]);

  useEffect(() => {
    if (applicationData.status?.id) {
      (async () => {
        await fetchWorkFlowAction();
      })();
    }
  }, [applicationData, fetchWorkFlowAction]);

  async function submitApplication(e) {
    e.preventDefault();
    try {
      const _ = await axios.post("/application/do-next", {
        application: { referenceNumber },
        assigner: { id },
        workFlowAction: { id: workFlowActionData.id },
      });
      toast.success("Success", {
        description: "Application Submitted Successfully",
      });
      navigate("/application-list");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <form>
      <div className="flex justify-end">
        <Button onClick={submitApplication}>Proceed to Pay</Button>
      </div>
    </form>
  );
}

export default PaymentCard;
