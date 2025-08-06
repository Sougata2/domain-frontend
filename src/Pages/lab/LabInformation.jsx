import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormSelect from "@/DomainComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";

const defaultValues = {
  id: "",
  lab: "",
};

function LabInformation() {
  const { referenceNumber } = useParams();
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const lab = watch("lab");

  const [labs, setLabs] = useState([]);

  const fetchApplicationDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `/application/by-reference-id/${referenceNumber}`
      );
      const data = response.data;

      reset({
        id: data.id,
        referenceNumber: data.referenceNumber,
        lab: data.lab === null ? "" : { label: data.lab.name, value: data.lab },
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber, reset]);

  const fetchLabs = useCallback(async () => {
    try {
      const response = await axios.get("/lab/all");
      const data = response.data;
      setLabs(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchApplicationDetails();
    })();
  }, [fetchApplicationDetails]);

  useEffect(() => {
    (async () => {
      await fetchLabs();
    })();
  }, [fetchLabs]);

  async function handleOnSubmit(data) {
    try {
      const payload = { ...data, lab: { id: data.lab.value.id } };
      const _ = await axios.put("/application", payload);
      await fetchApplicationDetails();
      toast.success("Success", { description: "LAB Information Saved" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }
  return (
    <Card className={"w-3xl"}>
      <CardHeader>
        <CardTitle>LAB Information</CardTitle>
        <CardDescription>choose a lab to test your device(s)</CardDescription>
      </CardHeader>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <CardContent className={"flex flex-col gap-2"}>
          <div className="flex flex-col gap-3">
            <FormSelect
              control={control}
              label={"LAB"}
              name={"lab"}
              error={errors.lab}
              options={labs}
              validation={{
                required: {
                  value: true,
                  message: "Lab selection is required",
                },
              }}
            />
            {lab && (
              <div>
                <table className="table-bordered">
                  <tbody>
                    <tr>
                      <td>Email</td>
                      <td>{lab.value.email}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>{lab.value.phone}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>{lab.value.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div>
            <Button>Save</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default LabInformation;
