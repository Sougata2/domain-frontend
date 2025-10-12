import { FaCheckCircle } from "react-icons/fa";

function ApplicationCompletedCard() {
  return (
    <div className="flex flex-col gap-1.5 justify-center items-center">
      <div>
        <FaCheckCircle size={30} className="text-green-500" />
      </div>
      <div className="text-2xl font-semibold text-slate-700">
        Application Completed
      </div>
    </div>
  );
}

export default ApplicationCompletedCard;
