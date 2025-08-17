import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoMdArrowDropright } from "react-icons/io";
import { toast } from "sonner";

import axios from "axios";
import PreviewDataBody from "./PreviewDataBody";
import PreviewDataCell from "./PreviewDataCell";

const PREVIEW_CONTEXT = createContext({});

export default function ApplicationPreviewCC({ referenceNumber, children }) {
  const [applicationData, setApplicationData] = useState({});

  const fetchApplicationData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-reference-id/${referenceNumber}`
      );
      const data = response.data;
      setApplicationData(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchApplicationData();
    })();
  }, [fetchApplicationData]);

  return (
    <PREVIEW_CONTEXT.Provider
      value={{
        referenceNumber,
        applicationData,
      }}
    >
      <div className="flex flex-col gap-4">{children}</div>
    </PREVIEW_CONTEXT.Provider>
  );
}

function BasicDetails() {
  const { applicationData } = useContext(PREVIEW_CONTEXT);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Details</CardTitle>
      </CardHeader>
      <CardContent>
        <PreviewDataBody>
          <PreviewDataCell
            label={"Application ID"}
            value={applicationData?.referenceNumber}
          />
          <PreviewDataCell
            label={"Sub Service"}
            value={applicationData?.subService?.name}
          />
          <PreviewDataCell
            label={"Service"}
            value={applicationData?.service?.name}
          />
        </PreviewDataBody>
      </CardContent>
    </Card>
  );
}

ApplicationPreviewCC.BasicDetails = BasicDetails;
