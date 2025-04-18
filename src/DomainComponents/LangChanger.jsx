import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function LangChanger() {
  const { t, i18n } = useTranslation();
  return (
    <div className={"flex"}>
      <div className={"w-full text-center py-4"}>{t("welcome")}</div>
      <div className="flex w-full justify-center gap-2.5">
        <Button
          className={"bg-slate-400 hover:bg-slate-500"}
          onClick={() => i18n.changeLanguage("en")}
        >
          English
        </Button>
        <Button
          className={"bg-slate-400 hover:bg-slate-500"}
          onClick={() => i18n.changeLanguage("hi")}
        >
          Hindi
        </Button>
      </div>
    </div>
  );
}
