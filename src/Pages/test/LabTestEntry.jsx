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
import { useEffect, useRef } from "react";
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

function LabTestEntry() {
  const { id: testId } = useParams();
  const sheetContainerRef = useRef(null);

  useEffect(() => {
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
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);
    univer.registerPlugin(UniverSheetsFormulaUIPlugin);
    univer.registerPlugin(UniverSheetsNumfmtPlugin);
    univer.registerPlugin(UniverSheetsNumfmtUIPlugin);

    univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
      id: "workbook-1",
      name: "Lab Report",
      sheetOrder: [testId],
      styles: {
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
      },

      sheets: {
        [testId]: {
          id: testId,
          name: testId,
          rowCount: 100,
          columnCount: 8,
          cellData: {
            // Row 0 (top headers)
            0: {
              0: { v: "No.", s: "header", locked: true },
              1: { v: "Type", s: "header", locked: true },
              2: { v: "", s: "header", locked: true },
              3: { v: "", s: "header", locked: true },
              4: { v: "", s: "header", locked: true },
              5: { v: "", s: "header", locked: true },
              6: { v: "Remarks", s: "header", locked: true },
              7: { v: "", s: "header", locked: true },
            },
            // Row 1 (second-level headers, locked: true)
            1: {
              0: { v: "", s: "header", locked: true },
              1: { v: "A", s: "header", locked: true },
              2: { v: "", s: "header", locked: true },
              3: { v: "", s: "header", locked: true },
              4: { v: "B", s: "header", locked: true },
              5: { v: "C", s: "header", locked: true },
              6: { v: "A", s: "header", locked: true },
              7: { v: "B", s: "header", locked: true },
            },
            // Row 2 (third-level headers, locked: true)
            2: {
              0: { v: "", s: "header", locked: true },
              1: { v: "1", s: "header", locked: true },
              2: { v: "2", s: "header", locked: true },
              3: { v: "3", s: "header", locked: true },
              4: { v: "", s: "header", locked: true },
              5: { v: "", s: "header", locked: true },
              6: { v: "", s: "header", locked: true },
              7: { v: "", s: "header", locked: true },
            },
          },
          mergeData: [
            { startRow: 0, endRow: 2, startColumn: 0, endColumn: 0 }, // "No."
            { startRow: 0, endRow: 0, startColumn: 1, endColumn: 5 }, // "Type"
            { startRow: 1, endRow: 1, startColumn: 1, endColumn: 3 }, // "A" under Type
            { startRow: 1, endRow: 2, startColumn: 4, endColumn: 4 }, // "B" under Type
            { startRow: 1, endRow: 2, startColumn: 5, endColumn: 5 }, // "C" under Type
            { startRow: 0, endRow: 0, startColumn: 6, endColumn: 7 }, // "Remarks"
            { startRow: 1, endRow: 2, startColumn: 6, endColumn: 6 }, // "A" under Remarks
            { startRow: 1, endRow: 2, startColumn: 7, endColumn: 7 }, // "B" under Remarks
          ],
        },
      },
    });

    FUniver.newAPI(univer);
  }, [testId]);

  return (
    <div className="flex justify-center items-center h-[95%]">
      <Card className="flex w-[85%] h-full">
        <CardHeader>
          <CardTitle>%TEST NAME%</CardTitle>
          <CardDescription>Enter the test data below</CardDescription>
          <CardAction>
            <Button>Submit Report</Button>
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
