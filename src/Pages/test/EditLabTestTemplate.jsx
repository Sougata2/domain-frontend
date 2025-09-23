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

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import FormInput from "@/DomainComponents/FormInput";
import { Button } from "@/components/ui/button";

const defaultValues = {
  name: "",
  header: "",
  mergeData: "",
};

const styles = {
  header: {
    ht: 2, // center horizontally
    vt: 2, // middle vertically
    bl: false, // bold
    bg: { rgb: "#f2f2f2" },
    bd: {
      t: { s: 1, cl: { rgb: "#333" } },
      b: { s: 1, cl: { rgb: "#333" } },
      l: { s: 1, cl: { rgb: "#333" } },
      r: { s: 1, cl: { rgb: "#333" } },
    },
    textIndent: 2,
  },
};

function EditLabTestTemplate() {
  const { id } = useParams();
  const sheetContainerRef = useRef(null);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [templateWorkBook, setTemplateWorkBook] = useState([]);
  const [templateError, setTemplateError] = useState("");
  const [template, setTemplate] = useState({
    header: {},
    mergeData: [],
  });

  const fetchTemplate = useCallback(async () => {
    try {
      const response = await axios.get(`/lab-test-template/${id}`);
      const data = response.data;
      reset({ id: data.id, name: data.name });
      setTemplate({
        ...data,
        header: JSON.parse(data.header),
        mergeData: JSON.parse(data.mergeData),
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id, reset]);

  useEffect(() => {
    (async () => {
      await fetchTemplate();
    })();
  }, [fetchTemplate]);

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
        styles,
        sheets: {
          sheet1: {
            id: "sheet1",
            name: "sheet1",
            rowCount: 10,
            columnCount: 20,
            cellData: {
              ...template?.header,
            },
            mergeData: [...template.mergeData],
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
  }, [template.header, template.mergeData]);

  function checkForCellWithSpaces(cellData) {
    for (const row in cellData) {
      for (const value in cellData[row]) {
        if (
          cellData[row][value]?.v &&
          /^[a-zA-Z]*$/.test(cellData[row][value]) &&
          cellData[row][value]?.v?.match(/^\s+$/)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  async function handleOnSubmit(data) {
    try {
      await templateWorkBook.endEditingAsync(true);
      const snap = templateWorkBook.getActiveSheet().getSheet().getSnapshot();
      if (checkForCellWithSpaces(snap.cellData)) {
        setTemplateError("Spaces are not allowed");
        return;
      } else if (!checkForCellWithSpaces(snap.cellData)) {
        setTemplateError("");
      }
      if (Object.keys(snap.cellData).length <= 0) {
        setTemplateError("Test template is required");
        return;
      } else if (Object.keys(snap.cellData).length > 0) {
        setTemplateError("");
      }

      for (const row in snap.cellData) {
        for (const col in snap.cellData[row]) {
          if (
            Object.keys(snap.cellData[row][col]).includes("v") &&
            Object.keys(snap.cellData[row][col]).includes("s")
          ) {
            snap.cellData[row][col]["s"] = "header";
          }
        }
      }

      const payload = {
        ...data,
        header: JSON.stringify(snap.cellData),
        mergeData: JSON.stringify(snap.mergeData),
      };

      const _ = await axios.put("/lab-test-template", payload);
      toast.info("Success", { description: "Lab Test Template Updated" });
      templateWorkBook.getActiveSheet().clear();
      await fetchTemplate();
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
            {/* <span className="text-slate-500">
              ( <PiWarningCircleLight className="inline" /> only the template
              structure will be saved, not the style)
            </span> */}
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

export default EditLabTestTemplate;
