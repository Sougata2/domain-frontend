import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function AddUser() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  function onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/domain/user",
          data,
          {
            headers: {
              Authorization: Cookies.get("Authorization"),
            },
          }
        );
        console.log(response);
        navigate("/");
      } catch (e) {
        setError(e.response.data);
      }
    })();
  }

  return (
    <div className={"flex justify-center items-center py-12"}>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"firstName"}>First Name</Label>
          <Input
            name={"firstName"}
            placeholder={"First Name"}
            value={data.firstName}
            id={"firstName"}
            onChange={onChange}
          />
          {error && (
            <span className={"text-sm text-red-400"}>
              {error.errors.firstName}
            </span>
          )}
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"lastName"}>Last Name</Label>
          <Input
            name={"lastName"}
            placeholder={"Last Name"}
            value={data.lastName}
            id={"lastName"}
            onChange={onChange}
          />
          {error && (
            <span className={"text-sm text-red-400"}>
              {error.errors.lastName}
            </span>
          )}
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"email"}>Email</Label>
          <Input
            name={"email"}
            placeholder={"Email"}
            value={data.email}
            id={"email"}
            onChange={onChange}
          />
          {error && (
            <span className={"text-sm text-red-400"}>{error.errors.email}</span>
          )}
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"password"}>Password</Label>
          <Input
            name={"password"}
            placeholder={"password"}
            value={data.password}
            id={"password"}
            onChange={onChange}
          />
          {error && (
            <span className={"text-sm text-red-400"}>
              {error.errors.password}
            </span>
          )}
        </div>
        <Button>Submit</Button>
      </form>
    </div>
  );
}
