import ApplicationPreviewCC from "@/DomainComponents/ApplicationPreviewCC";
import React from "react";
import { useParams } from "react-router";

function TaskDetailForTesting() {
  const { referenceNumber } = useParams();
  return (
    <ApplicationPreviewCC referenceNumber={referenceNumber}>
      <ApplicationPreviewCC.BasicDetails />
      <ApplicationPreviewCC.DeviceDetails />
      <ApplicationPreviewCC.LabInformation />
      <ApplicationPreviewCC.Documents />
    </ApplicationPreviewCC>
  );
}

export default TaskDetailForTesting;
