import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploadButton from "@/DomainComponents/FileUploadButton";

function UserDocument() {
  return (
    <Card className={"w-3xl"}>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Upload your supporting documents</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-bordered">
          <tbody>
            <tr>
              <td className="capitalize">device image</td>
              <td>
                <FileUploadButton />
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default UserDocument;
