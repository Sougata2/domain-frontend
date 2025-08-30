import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import PreviewDataBody from "./PreviewDataBody";
import PreviewDataCell from "./PreviewDataCell";
import Download from "./Download";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

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

function DeviceDetails() {
  const { referenceNumber } = useContext(PREVIEW_CONTEXT);
  const [devices, setDevices] = useState([]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(
        `/device/by-application-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setDevices(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchDevices();
    })();
  }, [fetchDevices]);

  if (devices.length < 1) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent className={"overflow-x-scroll"}>
        <table className="table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Height</th>
              <th>Length</th>
              <th>Weight</th>
              <th>Quantity</th>
              <th>Activities</th>
              <th>Specifications</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d, index) => (
              <tr key={d.id}>
                <th>{index + 1}</th>
                <td>{d.name}</td>
                <td>
                  {d.height} {d.heightUnit}
                </td>
                <td>
                  {d.length} {d.lengthUnit}
                </td>
                <td>
                  {d.weight} {d.weightUnit}
                </td>
                <td>{d.quantity}</td>
                <td>
                  {d?.activities.map((a) => (
                    <Badge key={a.name}>{a.name}</Badge>
                  ))}
                </td>
                <td>
                  {d?.specifications.map((s) => (
                    <Badge key={s.name}>{s.name}</Badge>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function LabInformation() {
  const { applicationData } = useContext(PREVIEW_CONTEXT);
  if (!applicationData.lab) return;
  return (
    <Card>
      <CardHeader>
        <CardTitle>LAB Information</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="table-bordered">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{applicationData.lab?.name}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{applicationData.lab?.phone}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{applicationData.lab?.email}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{applicationData.lab?.address}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function Documents() {
  const { referenceNumber } = useContext(PREVIEW_CONTEXT);
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get(
        `/document/by-reference-number/${referenceNumber}`
      );
      const data = response.data;

      // sort according to is mandatory or not.
      data.sort((a, b) => {
        const first =
          a.mandatoryDocument === null ? "user upload" : "mandatory";
        const second =
          b.mandatoryDocument === null ? "user upload" : "mandatory";
        return first.localeCompare(second);
      });
      setDocuments(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchDocuments();
    })();
  }, [fetchDocuments]);

  if (documents.length < 1) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="table-bordered">
          <tbody>
            {documents.map((d, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{d.name}</td>
                <td>
                  {d.mandatoryDocument === null ? (
                    <Badge variant={"secondary"}>User uploaded</Badge>
                  ) : (
                    <Badge>Mandatory</Badge>
                  )}
                </td>
                <td>
                  <Download fileId={d?.file.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function ApplicationSubmitSection() {
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user);
  const { referenceNumber, applicationData } = useContext(PREVIEW_CONTEXT);
  const [workFlowActionData, setWorkFlowActionData] = useState("");

  const fetchWorkFlowAction = useCallback(async () => {
    try {
      const response = await axios.get(
        `/workflow-action/by-status/${applicationData.status?.id}`
      );
      const data = response.data;
      setWorkFlowActionData(data[0]);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [applicationData]);

  useEffect(() => {
    if (applicationData.status?.id) {
      (async () => {
        await fetchWorkFlowAction();
      })();
    }
  }, [applicationData, fetchWorkFlowAction]);

  async function submitApplication() {
    try {
      const _ = await axios.post("/application/do-next", {
        application: { referenceNumber },
        assigner: { id },
        workFlowAction: { id: workFlowActionData.id },
      });
      toast.success("Success", {
        description: "Application Submitted Successfully",
      });
      navigate("/application-list");
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div>
      {applicationData.status?.name !== "AG" && (
        <Button disabled={true}>Application Submitted</Button>
      )}
      {applicationData.status?.name === "AG" && (
        <Button onClick={submitApplication}>Submit Application</Button>
      )}
    </div>
  );
}

ApplicationPreviewCC.Documents = Documents;
ApplicationPreviewCC.BasicDetails = BasicDetails;
ApplicationPreviewCC.DeviceDetails = DeviceDetails;
ApplicationPreviewCC.LabInformation = LabInformation;
ApplicationPreviewCC.ApplicationSubmitSection = ApplicationSubmitSection;
