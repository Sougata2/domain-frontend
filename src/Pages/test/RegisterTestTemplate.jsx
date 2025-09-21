import {
  LocaleType,
  mergeLocales,
  Univer,
  UniverInstanceType,
} from "@univerjs/core";
import { FUniver } from "@univerjs/core/facade";
import DesignEnUS from "@univerjs/design/locale/en-US";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import DocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import SheetsFormulaUIEnUS from "@univerjs/sheets-formula-ui/locale/en-US";
import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsNumfmtUIPlugin } from "@univerjs/sheets-numfmt-ui";
import SheetsNumfmtUIEnUS from "@univerjs/sheets-numfmt-ui/locale/en-US";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import SheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
import SheetsEnUS from "@univerjs/sheets/locale/en-US";
import { UniverUIPlugin } from "@univerjs/ui";

import UIEnUS from "@univerjs/ui/locale/en-US";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";
import "@univerjs/sheets-numfmt-ui/lib/index.css";
import "@univerjs/engine-formula/facade";
import "@univerjs/ui/facade";
import "@univerjs/docs-ui/facade";
import "@univerjs/sheets/facade";
import "@univerjs/sheets-ui/facade";
import "@univerjs/sheets-formula/facade";
import "@univerjs/sheets-numfmt/facade";

import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { PiWarningCircleLight } from "react-icons/pi";

const defaultValues = {
  name: "",
  header: "",
  mergeData: "",
};

function RegisterTestTemplate() {
  const sheetContainerRef = useRef(null);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [templateWorkBook, setTemplateWorkBook] = useState([]);
  const [templateError, setTemplateError] = useState("");

  useEffect(() => {
    (async () => {
      const containerNode = sheetContainerRef.current;

      const univer = new Univer({
        locale: LocaleType.EN_US,
        locales: {
          [LocaleType.EN_US]: mergeLocales(
            DesignEnUS,
            UIEnUS,
            DocsUIEnUS,
            SheetsEnUS,
            SheetsUIEnUS,
            SheetsFormulaUIEnUS,
            SheetsNumfmtUIEnUS
          ),
        },
      });

      univer.registerPlugin(UniverRenderEnginePlugin);
      univer.registerPlugin(UniverFormulaEnginePlugin);

      univer.registerPlugin(UniverUIPlugin, {
        container: containerNode,
      });

      univer.registerPlugin(UniverDocsPlugin);
      univer.registerPlugin(UniverDocsUIPlugin);
      univer.registerPlugin(UniverSheetsPlugin);
      univer.registerPlugin(UniverSheetsUIPlugin, {
        protectedRangeShadow: false,
      });
      univer.registerPlugin(UniverSheetsFormulaPlugin);
      univer.registerPlugin(UniverSheetsFormulaUIPlugin);
      univer.registerPlugin(UniverSheetsNumfmtPlugin);
      univer.registerPlugin(UniverSheetsNumfmtUIPlugin);

      univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
        id: "workbook-1",
        name: "test-template",
        sheetOrder: ["sheet1"],
        sheets: {
          sheet1: {
            id: "sheet1",
            name: "sheet1",
            rowCount: 10,
            columnCount: 20,
          },
        },
      });

      const univerApi = FUniver.newAPI(univer);
      const workbook = univerApi.getActiveWorkbook();
      const unitId = workbook.getId();
      const permission = workbook.getPermission();

      const workbookCreateSheetPermission =
        permission.permissionPointsDefinition.WorkbookCreateSheetPermission;

      permission.setWorkbookPermissionPoint(
        unitId,
        workbookCreateSheetPermission,
        false
      );

      setTemplateWorkBook(workbook);

      univerApi.onBeforeCommandExecute((command) => {
        if (command.id === "sheet.command.insert-sheet") {
          toast.warning("Creation of new sheet is prohibited");
          throw new Error("Creation of new sheet is prohibited");
        }

        if (
          command.id ===
          "sheet.command.delete-range-protection-from-context-menu"
        ) {
          toast.warning("Editing Permission is prohibited");
          throw new Error("Editing Permission is prohibited");
        }
      });
    })();
  }, []);

  async function handleOnSubmit(data) {
    try {
      await templateWorkBook.endEditingAsync(true);
      const snap = templateWorkBook.getActiveSheet().getSheet().getSnapshot();
      if (Object.keys(snap.cellData).length <= 0) {
        setTemplateError("Test template is required");
        return;
      } else if (Object.keys(snap.cellData).length > 0) {
        setTemplateError("");
      }

      const payload = {
        ...data,
        header: JSON.stringify(snap.cellData),
        mergeData: JSON.stringify(snap.mergeData),
      };

      reset(defaultValues);
      templateWorkBook.getActiveSheet().clear();

      console.log(payload);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        className="flex flex-col gap-5 w-3xl"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <FormInput
          register={register}
          name={"name"}
          label={"Test Name"}
          error={errors.name}
          validation={{
            required: {
              value: true,
              message: "Test name is required",
            },
          }}
        />
        <div className="flex flex-col gap-3 h-[26rem]">
          <Label>
            <span>Template</span>
            <span className="text-slate-500">
              ( <PiWarningCircleLight className="inline" /> only the template
              structure will be saved, not the style)
            </span>
          </Label>
          <div
            ref={sheetContainerRef}
            className="h-full w-full border rounded overflow-hidden"
          />
          {templateError && (
            <div className="text-xs text-red-500">{templateError}</div>
          )}
        </div>
        <div className="flex justify-end">
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default RegisterTestTemplate;
