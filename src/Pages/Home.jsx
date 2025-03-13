import DomainDataTable from "@/DomainComponents/DomainDataTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:8080/domain/user/list",
        {
          headers: {
            Authorization: Cookies.get("Authorization"),
          },
        }
      );
      setUsers(response.data);
    })();
  }, []);

  return (
    <div>
      <DomainDataTable users={users} />
    </div>
  );
}
