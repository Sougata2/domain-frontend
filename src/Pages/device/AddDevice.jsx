import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/DomainComponents/FormInput";

function AddDevice() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Register Device</CardTitle>
            <CardDescription>
              Register your device for Testing activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>{/* <FormInput /> */}</form>
          </CardContent>
          <CardFooter>
            <p>Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AddDevice;
