import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import TaskDetailForService12 from "./TaskDetails/TaskDetailForSubService12";

function TaskDetails({ referenceNumber }) {
  const [applicationData, setApplicationData] = useState("");
  const fetchApplication = useCallback(async () => {
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

  useEffect(() => {
    (async () => {
      await fetchApplication();
    })();
  }, [fetchApplication]);

  function DetailsBySubService() {
    switch (applicationData.subService?.id) {
      case 12:
        return <TaskDetailForService12 />;

      default:
        return <div>No Task View Available</div>;
    }
  }

  return <>{applicationData?.subService && DetailsBySubService()}</>;
}

export default TaskDetails;
