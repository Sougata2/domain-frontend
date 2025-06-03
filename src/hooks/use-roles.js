import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function useRoles() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_URL + "/role"
        );
        const data = response.data;
        setData(data);
      } catch (e) {
        toast.error("Error", { description: e.message });
      }
    })();
  }, []);

  return { data };
}

export default useRoles;
