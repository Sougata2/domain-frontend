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
import UIEnUS from "@univerjs/ui/locale/en-US";

import { useParams } from "react-router";
import { useEffect, useRef } from "react";

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
      sheetOrder: [testId], // 👈 required
      sheets: {
        [testId]: {
          id: testId,
          name: testId,
          rowCount: 100, // 👈 must define rows
          columnCount: 20, // 👈 must define columns
          cellData: {
            0: {
              0: { v: "Patient ID" },
              1: { v: "Patient Name" },
              2: { v: "Test Name" },
              3: { v: "Result" },
              4: { v: "Units" },
              5: { v: "Reference Range" },
            },
          },
        },
      },
    });

    FUniver.newAPI(univer);
  }, []);

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
