import TaskDetailForTesting from "./TaskDetails/TaskDetailForTesting";

function TaskDetails({ applicationData }) {
  function DetailsBySubService() {
    switch (applicationData.service?.name) {
      case "Testing":
        return <TaskDetailForTesting />;

      default:
        return <div>No Task View Available</div>;
    }
  }

  return <>{applicationData?.service && DetailsBySubService()}</>;
}

export default TaskDetails;
