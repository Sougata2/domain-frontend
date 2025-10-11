import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DataTable from "@/DomainComponents/DataTable";
import Download from "@/DomainComponents/Download";
import FormFileInput from "@/DomainComponents/FormComponents/FormFileInput";
import FormTextarea from "@/DomainComponents/FormComponents/FormTextarea";
import FormInput from "@/DomainComponents/FormInput";
import { ArrowUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

const defaultValues = {
  file: "",
  name: "",
  description: "",
};

function IssueCertificateCard() {
  const { referenceNumber } = useParams();
  const {
    register,
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Certificate
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Certificate Description
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "file",
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3">
            <div>
              <Download fileId={row.getValue("file")?.id} />
            </div>
          </div>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);

  async function handleOnSubmit(data) {
    try {
      console.log(data);
      setOpen(false);
      toast.success("Success", { description: "Certificate Issued" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="relative">
      <div>
        <DataTable
          columns={columns}
          data={[]}
          options={{ searchField: "name" }}
        />
      </div>
      <div className="absolute top-3.5 right-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Issue Certificate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Certificate</DialogTitle>
              <DialogDescription>
                Fill in the details to issue a certificate.
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-3.5"
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <FormInput
                register={register}
                error={errors.name}
                label={"Certificate Name"}
                name={"name"}
                validation={{
                  required: {
                    value: true,
                    message: "Certificate Name is required",
                  },
                }}
              />
              <FormFileInput
                register={register}
                label={"Certificate"}
                name={"file"}
                error={errors.file}
                validation={{
                  required: {
                    value: true,
                    message: "Certificate is required",
                  },
                }}
              />
              <FormTextarea
                register={register}
                label={"Description"}
                name={"description"}
                error={errors.description}
                validation={{
                  required: {
                    value: false,
                    message: "Description of Certificate is required",
                  },
                }}
              />
              <div className="flex justify-end">
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearErrors();
                        reset(defaultValues);
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Issue</Button>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default IssueCertificateCard;
