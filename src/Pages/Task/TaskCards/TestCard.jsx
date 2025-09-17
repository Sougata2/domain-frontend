import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

function TestCard({ jobId }) {
  return (
    <div>
      <Link to={`/lab-test-entry/${1}`}>Link</Link>
    </div>
  );
}

export default TestCard;
