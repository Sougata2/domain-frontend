import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export default function DeleteUser() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  async function onDelete() {
    await axios.delete(`http://localhost:8080/domain/user/${id}`, {
      headers: {
        Authorization: Cookies.get("Authorization"),
      },
    });
    navigate("/home");
  }

  return (
    <div className={"flex justify-center items-center w-full pt-52"}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("Delete User")}</CardTitle>
          <CardDescription>{t("proceed to delete")}</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            {t("Cancel")}
          </Button>
          <Button className={"bg-red-400 hover:bg-red-500"} onClick={onDelete}>
            {t("Delete")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
