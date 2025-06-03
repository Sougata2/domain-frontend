import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

function useMenu(topLevel = 0) {
  const [data, setData] = useState([]);

  useState(() => {
    (async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_URL +
            "/menu" +
            `${topLevel === 1 ? "?top-level=1" : ""}`
        );
        setData(response.data);
      } catch (error) {
        toast.error("Error", { description: error.message });
      }
    })();
  }, []);

  return { data };
}

export default useMenu;
