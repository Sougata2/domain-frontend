import {
  LocaleType,
  mergeLocales,
  Univer,
  UniverInstanceType,
} from "@univerjs/core";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

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
import { toast } from "sonner";
import axios from "axios";

const styles = {
  header: {
    ht: 2, // center horizontally
    vt: 2, // middle vertically
    bg: { rgb: "#f2f2f2" },
    bd: {
      t: { s: 1, cl: { rgb: "#333" } },
      b: { s: 1, cl: { rgb: "#333" } },
      l: { s: 1, cl: { rgb: "#333" } },
      r: { s: 1, cl: { rgb: "#333" } },
    },
  },
};

function LabTestEntry() {
  const { jobId, templateId } = useParams();
  const sheetContainerRef = useRef(null);

  const [testWorkBook, setTestWorkBook] = useState(null);
  const [template, setTemplate] = useState({
    header: {},
    mergeData: [],
  });

  const fetchTemplate = useCallback(async () => {
    try {
      const response = await axios.get(`/lab-test-template/${templateId}`);
      const data = response.data;
      setTemplate({
        ...data,
        header: JSON.parse(data.header),
        mergeData: JSON.parse(data.mergeData),
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [templateId]);

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
            rowCount: 100,
            columnCount: template.columnCount ?? 20,
            cellData: {
              ...template?.header,
            },
            mergeData: [...template.mergeData],
          },
        },
      });

      const univerApi = FUniver.newAPI(univer);
      const workbook = univerApi.getActiveWorkbook();
      const sheet = workbook.getActiveSheet();
      const unitId = workbook.getId();
      const subUnitId = sheet.getSheetId();
      const permission = workbook.getPermission();

      const range = sheet.getRange(template.headerRange ?? "A1:A1");

      const rangeProtectionPermissionEditPoint =
        permission.permissionPointsDefinition
          .RangeProtectionPermissionEditPoint;

      const res = await permission.addRangeBaseProtection(unitId, subUnitId, [
        range,
      ]);

      permission.setRangeProtectionPermissionPoint(
        unitId,
        subUnitId,
        res.permissionId,
        rangeProtectionPermissionEditPoint,
        false
      );

      const workbookCreateSheetPermission =
        permission.permissionPointsDefinition.WorkbookCreateSheetPermission;

      permission.setWorkbookPermissionPoint(
        unitId,
        workbookCreateSheetPermission,
        false
      );

      setTestWorkBook(workbook);

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

      sheet.setActiveSelection(
        sheet.getRange(template.defaultSelection ?? "A1:A1")
      );
    })();
  }, [
    template.cellData,
    template.columnCount,
    template.defaultSelection,
    template?.header,
    template.headerRange,
    template.mergeData,
    template.name,
    templateId,
  ]);

  useEffect(() => {
    const handler = async (e) => {
      if (e.ctrlKey && e.key === "s" && testWorkBook !== null) {
        e.preventDefault();
        await testWorkBook.endEditingAsync(true);
        const snap = testWorkBook.getActiveSheet().getSheet().getSnapshot();
        console.log(snap.cellData);
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [testWorkBook]);

  async function handleSubmit() {
    try {
      await testWorkBook.endEditingAsync(true);
      const snap = testWorkBook.getActiveSheet().getSheet().getSnapshot();
      const headerRows = Object.keys(template.header).map((k) => Number(k));
      for (const key in snap.cellData) {
        if (headerRows.includes(Number(key))) {
          delete snap.cellData[Number(key)];
        }
      }
      const payload = {
        job: { id: Number(jobId) },
        template: { id: Number(templateId) },
        cellData: snap.cellData,
      };

      console.log(payload);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-[95%]">
      <Card className="flex w-[85%] h-full">
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
          <CardDescription>Enter the test data below</CardDescription>
          <CardAction>
            <Button onClick={handleSubmit}>Save</Button>
          </CardAction>
        </CardHeader>
        <CardContent className={"h-full"}>
          <div ref={sheetContainerRef} className="h-full w-full" />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

export default LabTestEntry;
