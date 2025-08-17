import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import PreviewDataBody from "./PreviewDataBody";
import PreviewDataCell from "./PreviewDataCell";
import axios from "axios";

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

ApplicationPreviewCC.BasicDetails = BasicDetails;
ApplicationPreviewCC.DeviceDetails = DeviceDetails;
ApplicationPreviewCC.LabInformation = LabInformation;
