import axios from "axios";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function ApplicationList() {
  const { id: userId } = useSelector((state) => state.user);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-status-and-user-id?user=${userId}`
      );
      const data = response.data;
      console.log(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      (async () => {
        await fetchApplications();
      })();
    }
  }, [userId, fetchApplications]);

  return (
    <div className="flex justify-center items-center">
      <div className="fle flex-col gap-3">Applications</div>
    </div>
  );
}

export default ApplicationList;
