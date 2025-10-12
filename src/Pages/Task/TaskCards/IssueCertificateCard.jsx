import {
  DialogDescription,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { ArrowUpDown } from "lucide-react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FormFileInput from "@/DomainComponents/FormComponents/FormFileInput";
import FormTextarea from "@/DomainComponents/FormComponents/FormTextarea";
import ActionCard from "./ActionCard";
import DataTable from "@/DomainComponents/DataTable";
import FormInput from "@/DomainComponents/FormInput";
import Download from "@/DomainComponents/Download";
import axios from "axios";

const defaultValues = {
  file: "",
  name: "",
  description: "",
};

function IssueCertificateCard() {
  const { referenceNumber } = useParams();
  const {
    formState: { errors },
    handleSubmit,
    clearErrors,
    register,
    reset,
  } = useForm({ defaultValues });

  const columns = [
    {
      accessorKey: "certificateNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Certificate Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ps-3">{row.getValue("certificateNumber")}</div>;
      },
    },
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
    {
      accessorKey: "id",
      header: () => {
        return <div></div>;
      },
      cell: ({ row }) => {
        return (
          <div className="ps-3">
            <div>
              <HiOutlineTrash
                onClick={() => handleDelete(row.getValue("id"))}
                size={20}
                className="text-red-400"
              />
            </div>
          </div>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);

  const fetchCertificates = useCallback(async () => {
    try {
      const response = await axios.get(
        `certificate/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setCertificates(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchCertificates();
    })();
  }, [fetchCertificates]);

  async function handleOnSubmit(data) {
    try {
      data = { ...data, application: { referenceNumber } };
      if (data.file.length > 0) {
        const file = data.file[0];
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadResponseData = uploadResponse.data;
        if (uploadResponseData) {
          data.file = { id: uploadResponseData.id };
        } else {
          data.file = null;
          throw new Error(
            "Something went wrong, document could not be uploaded"
          );
        }
      } else {
        data.file = null;
      }

      await axios.post("/certificate", data);
      toast.success("Success", { description: "Certificate Issued" });

      setOpen(false);
      reset(defaultValues);
      await fetchCertificates();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete("/certificate", { data: { id } });
      toast.warning("Revoked", { description: "Certficate revoked" });
      await fetchCertificates();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        <div>
          <DataTable
            columns={columns}
            data={certificates}
            options={{ searchField: "certificateNumber" }}
          />
        </div>
        {certificates.length > 0 && (
          <div>
            <ActionCard referenceNumber={referenceNumber} />
          </div>
        )}
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
