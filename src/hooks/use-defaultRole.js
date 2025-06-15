import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useDefaultRole(userId) {
  const [data, setData] = useState({});

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const response = await axios.get(`/user/default-role/${userId}`);
          setData(response.data);
        } catch (error) {
          toast.error("Error", {
            description: "Failed to fetch Default Role" + error.message,
          });
        }
      })();
    }
  }, [userId]);
  return { data };
}
