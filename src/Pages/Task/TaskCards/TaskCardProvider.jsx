import CreateJobCard from "../job/CreateJobCard";
import ActionCard from "./ActionCard";
import ActionCardWithUpload from "./ActionCardWithUpload";
import PaymentCard from "./PaymentCard";

function TaskCardProvider({ referenceNumber, jobId, actionType }) {
  switch (actionType) {
    case "ACTION":
      return <ActionCard referenceNumber={referenceNumber} jobId={jobId} />;
    case "ACTION_WITH_UPLOAD":
      return (
        <ActionCardWithUpload referenceNumber={referenceNumber} jobId={jobId} />
      );
    case "CREATE_JOB_CARD":
      return <CreateJobCard referenceNumber={referenceNumber} />;
    case "PAYMENT":
      return <PaymentCard referenceNumber={referenceNumber} />;
    case "NONE":
      return <div>Action form not decided yet</div>;
    default:
      return <div>Action form not decided yet</div>;
  }
}

export default TaskCardProvider;
