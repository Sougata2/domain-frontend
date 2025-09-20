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
import { useEffect, useRef, useState } from "react";
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

const cellData = {
  0: {
    0: { v: "No.", s: "header" },
    1: { v: "Type", s: "header" },
    2: { v: "", s: "header" },
    3: { v: "", s: "header" },
    4: { v: "", s: "header" },
    5: { v: "", s: "header" },
    6: { v: "Remarks", s: "header" },
    7: { v: "", s: "header" },
  },
  1: {
    0: { v: "", s: "header" },
    1: { v: "A", s: "header" },
    2: { v: "", s: "header" },
    3: { v: "", s: "header" },
    4: { v: "B", s: "header" },
    5: { v: "C", s: "header" },
    6: { v: "A", s: "header" },
    7: { v: "B", s: "header" },
  },
  2: {
    0: { v: "", s: "header" },
    1: { v: "1", s: "header" },
    2: { v: "2", s: "header" },
    3: { v: "3", s: "header" },
    4: { v: "", s: "header" },
    5: { v: "", s: "header" },
    6: { v: "", s: "header" },
    7: { v: "", s: "header" },
  },
};

const mergeData = [
  { startRow: 0, endRow: 2, startColumn: 0, endColumn: 0 }, // "No."
  { startRow: 0, endRow: 0, startColumn: 1, endColumn: 5 }, // "Type"
  { startRow: 1, endRow: 1, startColumn: 1, endColumn: 3 }, // "A" under Type
  { startRow: 1, endRow: 2, startColumn: 4, endColumn: 4 }, // "B" under Type
  { startRow: 1, endRow: 2, startColumn: 5, endColumn: 5 }, // "C" under Type
  { startRow: 0, endRow: 0, startColumn: 6, endColumn: 7 }, // "Remarks"
  { startRow: 1, endRow: 2, startColumn: 6, endColumn: 6 }, // "A" under Remarks
  { startRow: 1, endRow: 2, startColumn: 7, endColumn: 7 }, // "B" under Remarks
];

const columnCount = 8;
const headerRange = "A1:H3";
const defaultSelection = "A4:A4";

const styles = {
  header: {
    ht: 2, // center horizontally
    vt: 2, // middle vertically
    bl: true, // bold
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
  const { id: testId } = useParams();
  const sheetContainerRef = useRef(null);

  const [testWorkBook, setTestWorkBook] = useState(null);

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
        name: "Lab Report",
        sheetOrder: [testId],
        styles,
        sheets: {
          [testId]: {
            id: testId,
            name: testId,
            rowCount: 100,
            columnCount,
            cellData,
            mergeData,
          },
        },
      });

      const univerApi = FUniver.newAPI(univer);
      const workbook = univerApi.getActiveWorkbook();
      const sheet = workbook.getActiveSheet();
      const unitId = workbook.getId();
      const subUnitId = sheet.getSheetId();
      const permission = workbook.getPermission();

      const range = sheet.getRange(headerRange);

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

      sheet.setActiveSelection(sheet.getRange(defaultSelection));
    })();
  }, [testId]);

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

  return (
    <div className="flex justify-center items-center h-[95%]">
      <Card className="flex w-[85%] h-full">
        <CardHeader>
          <CardTitle>%TEST NAME%</CardTitle>
          <CardDescription>Enter the test data below</CardDescription>
          <CardAction>
            <Button
              onClick={async () => {
                await testWorkBook.endEditingAsync(true);
                const snap = testWorkBook
                  .getActiveSheet()
                  .getSheet()
                  .getSnapshot();
                console.log(snap);
              }}
            >
              Submit Report
            </Button>
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
