import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router";
import CryptoJS from "crypto-js";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    setData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    // encrypt the password for security.
    const SECRET_KEY = CryptoJS.enc.Utf8.parse(
      import.meta.env.VITE_AES_SECRET_KEY
    );

    console.log(import.meta.env.VITE_AES_SECRET_KEY);

    const encryptedPassword = CryptoJS.AES.encrypt(data.password, SECRET_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    try {
      const response = await axios.post(
        "http://localhost:8080/domain/auth/login",
        { ...data, password: encryptedPassword }
      );
      Cookies.set("Authorization", `Bearer ${response.data.token}`);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={"flex justify-center items-center"}>
      <form className={"flex flex-col gap-2.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"email"} id={"email"}>
            Email
          </Label>
          <Input
            placeholder={"Email"}
            name={"email"}
            value={data.email}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"email"} id={"email"}>
            Password
          </Label>
          <Input
            placeholder={"Password"}
            name={"password"}
            value={data.password}
            onChange={onChange}
          />
        </div>
        <Button>Login</Button>
      </form>
    </div>
  );
}
