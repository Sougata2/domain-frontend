import TaskDetailForTesting from "./TaskDetails/TaskDetailForTesting";

function TaskDetails({ applicationData }) {
  function DetailsBySubService() {
    switch (applicationData.service?.name.toLowerCase()) {
      case "testing":
        return <TaskDetailForTesting />;

      default:
        return <div>No Task View Available</div>;
    }
  }

  return <>{applicationData?.service && DetailsBySubService()}</>;
}

export default TaskDetails;
