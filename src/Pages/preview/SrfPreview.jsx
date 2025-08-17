import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApplicationPreviewCC from "@/DomainComponents/ApplicationPreviewCC";
import { useParams } from "react-router";

function SrfPreview() {
  const { referenceNumber } = useParams();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Application Preview</CardTitle>
            <CardDescription>Final Submition of application</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationPreviewCC referenceNumber={referenceNumber}>
              <ApplicationPreviewCC.BasicDetails />
              <ApplicationPreviewCC.DeviceDetails />
            </ApplicationPreviewCC>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SrfPreview;
