import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useValidateToken(token) {
  const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post("/auth/validate-token", { token });
        setData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Error", { description: "Failed To Validate Token" });
      }
    })();
  }, [token]);
  return { data };
}
