import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function ViewUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:8080/domain/user/" + id,
        {
          headers: {
            Authorization: Cookies.get("Authorization"),
          },
        }
      );
      setUser(response.data);
    })();
  }, [id]);

  return (
    <div className={"flex justify-center items-center w-full h-[100vh]"}>
      <Card className={"p-15"}>
        <CardHeader>
          <CardTitle>{user?.firstName}</CardTitle>
          <CardDescription>{user?.lastName}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{user?.email}</p>
        </CardContent>
        <CardFooter>
          <p>{user?.createdAt}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
