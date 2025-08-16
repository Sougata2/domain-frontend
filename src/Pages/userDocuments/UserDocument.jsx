import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "@/DomainComponents/FormInput";

import Download from "@/DomainComponents/Download";
import Upload from "@/DomainComponents/Upload";
import axios from "axios";

function UserDocument() {
  const { referenceNumber } = useParams();
  const [mandatoryDocuments, setMandatoryDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploadedMandatoryDocument, setUploadedMandatoryDocument] = useState(
    {}
  );

  const fetchMandatoryDocuments = useCallback(async () => {
    try {
      const response = await axios.get(
        `/mandatory-document/by-reference-number/${referenceNumber}`
      );
      const data = response.data;
      setMandatoryDocuments(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  const fetchUserDocuments = useCallback(async () => {
    try {
      const response = await axios.get(
        `/document/by-reference-number/${referenceNumber}`
      );
      setDocuments(response.data);

      const map = {};
      response.data.forEach((d) => {
        if (d.mandatoryDocument !== null) {
          map[d.mandatoryDocument.id] = d.file;
        }
      });
      setUploadedMandatoryDocument({ ...map });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchMandatoryDocuments();
    })();
  }, [fetchMandatoryDocuments]);

  useEffect(() => {
    (async () => {
      await fetchUserDocuments();
    })();
  }, [fetchUserDocuments]);

  async function handleFileUpload(e, mandatoryDocId, mandatoryDocName) {
    try {
      const uploadedDocument = documents.find(
        (d) => d.mandatoryDocument?.id === mandatoryDocId
      );

      if (uploadedDocument) {
        const _ = await axios.put("/document", {
          id: uploadedDocument.id,
          file: { id: e.id },
          mandatoryDocument: { id: mandatoryDocId },
        });
      } else {
        const _ = await axios.post("/document", {
          name: mandatoryDocName,
          file: { id: e.id },
          application: { referenceNumber },
          mandatoryDocument: { id: mandatoryDocId },
        });
      }
      await fetchUserDocuments();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function updateAdditionalDocument(doc, file) {
    try {
      const payload = {
        id: doc.id,
        file: { id: file.id },
      };
      const _ = await axios.put("/document", payload);
      await fetchUserDocuments();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <Card className={"w-3xl"}>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Upload your supporting documents</CardDescription>
      </CardHeader>
      <CardContent className={"flex flex-col gap-3"}>
        <div>
          <div className="font-semibold">Mandatory documents</div>
          <table className="table-bordered">
            <tbody>
              {mandatoryDocuments.map((md, index) => (
                <tr key={md.id} className="grid grid-cols-[1fr_10fr_1fr]">
                  <td>{index + 1}</td>
                  <td className="capitalize">{md.name}</td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <Upload
                        onUpload={(e) => handleFileUpload(e, md.id, md.name)}
                      />
                      {uploadedMandatoryDocument[md.id] && (
                        <Download
                          fileId={uploadedMandatoryDocument[md.id].id}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {documents.filter((d) => d.mandatoryDocument === null).length > 0 && (
          <div>
            <div className="font-semibold">
              Additional Documents{" "}
              <span className="font-light">(uploaded by user)</span>
            </div>
            <div>
              <table className="table-bordered">
                <tbody>
                  {documents
                    .filter((d) => d.mandatoryDocument === null)
                    .map((d, index) => (
                      <tr key={d.id} className="grid grid-cols-[1fr_10fr_1fr]">
                        <td>{index + 1}</td>
                        <td className="capitalize">{d.name}</td>
                        <td>
                          <div className="flex gap-2 items-center">
                            <Upload
                              onUpload={(e) => updateAdditionalDocument(d, e)}
                            />
                            <Download fileId={d.file.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <UploadAdditionalDocument
          existingFileNames={documents.map((d) => d.name)}
          onAdditionalDocumentUpload={async () => await fetchUserDocuments()}
        />
      </CardFooter>
    </Card>
  );
}

const defaultValues = {
  name: "",
  file: "",
};

function UploadAdditionalDocument({
  existingFileNames,
  onAdditionalDocumentUpload,
}) {
  const { referenceNumber } = useParams();
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onChange" });

  const name = watch("name");

  async function submitHandler(data) {
    try {
      const payload = {
        name: data.name,
        file: { id: data.file.id },
        application: { referenceNumber },
      };

      const _ = await axios.post("/document", payload);
      onAdditionalDocumentUpload();
      reset(defaultValues);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div
      className={`flex ${errors.name ? "items-center" : "items-end"} gap-1.5`}
    >
      <div>
        <FormInput
          register={register}
          label={"Additional File Name"}
          name={"name"}
          error={errors.name}
          validation={{
            required: {
              value: false,
              message: "File Name is required",
            },
            validate: {
              validateSameFileName: (value) =>
                !existingFileNames.includes(value) ||
                "File with same name already exists",
            },
          }}
        />
      </div>
      <div>
        <Upload
          disabled={!name || errors.name}
          onUpload={(e) => {
            setValue("file", { ...e });
            handleSubmit(submitHandler)();
          }}
        />
      </div>
    </div>
  );
}

export default UserDocument;
