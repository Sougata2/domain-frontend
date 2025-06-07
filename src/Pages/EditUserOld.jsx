import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export default function EditUserOld() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

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

      setData((prevData) => {
        return {
          ...prevData,
          ...response.data,
        };
      });
    })();
  }, [id]);

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

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8080/domain/user", data, {
        headers: {
          Authorization: Cookies.get("Authorization"),
        },
      });
      navigate("/user/" + id);
    } catch (e) {
      setError(e.response.data);
    }
  }
  return (
    <div className={"flex justify-center items-center py-12"}>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"firstName"}>{t("First Name")}</Label>
          <Input
            name={"firstName"}
            placeholder={`${t("First Name")}`}
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
          <Label htmlFor={"lastName"}>{t("Last Name")}</Label>
          <Input
            name={"lastName"}
            placeholder={`${t("Last Name")}`}
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
          <Label htmlFor={"email"}>{t("Email")}</Label>
          <Input
            name={"email"}
            placeholder={`${t("Email")}`}
            value={data.email}
            id={"email"}
            onChange={onChange}
          />
          {error && (
            <span className={"text-sm text-red-400"}>{error.errors.email}</span>
          )}
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"password"}>{t("Password")}</Label>
          <Input
            name={"password"}
            placeholder={`${t("Password")}`}
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
        <Button>{t("Submit")}</Button>
      </form>
    </div>
  );
}
