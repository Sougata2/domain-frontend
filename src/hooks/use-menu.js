import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import { toast } from "sonner";

function useMenu(topLevel = 0) {
  const [data, setData] = useState([]);

  const refreshHandler = useCallback(async () => {
    try {
      const response = await axios.get(
        "/menu" + `${topLevel === 1 ? "?top-level=1" : ""}`,
        {
          headers: {
            Authorization: Cookies.get("Authorization"),
          },
        }
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [topLevel]);

  useState(() => {
    (async () => {
      await refreshHandler();
    })();
  }, []);

  return { data, refreshHandler };
}

export default useMenu;
