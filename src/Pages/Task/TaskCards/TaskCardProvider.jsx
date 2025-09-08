import ActionCard from "./ActionCard";
import ActionCardWithUpload from "./ActionCardWithUpload";

function TaskCardProvider({ referenceNumber, actionType }) {
  switch (actionType) {
    case "ACTION":
      return <ActionCard referenceNumber={referenceNumber} />;
    case "ACTION_WITH_UPLOAD":
      return <ActionCardWithUpload referenceNumber={referenceNumber} />;
    case "CREATE_JOB_CARD":
      return <div>Action form not decided yet</div>;
    case "PAYMENT":
      return <div>Action form not decided yet</div>;
    case "NONE":
      return <div>Action form not decided yet</div>;
    default:
      return <div>Action form not decided yet</div>;
  }
}

export default TaskCardProvider;
