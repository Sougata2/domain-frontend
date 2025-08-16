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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import axios from "axios";
import Upload from "@/DomainComponents/Upload";

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

  async function handleDownloadFile(fileId) {
    try {
      const response = await axios.get(`/file/download/${fileId}`, {
        responseType: "blob",
      });
      const blob = response.data;

      // Log the headers to see if filename is in the header
      const contentDisposition = response.headers["content-disposition"];

      // const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const fileNameMatch = contentDisposition.match(/filename="([^;]+)"/);
      const fileName = fileNameMatch?.[1] || "downloaded_file";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Success", { description: "File Downloaded successfully" });
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
      <CardContent>
        <table className="table-bordered">
          <tbody>
            {mandatoryDocuments.map((md, index) => (
              <tr key={md.id}>
                <td>{index + 1}</td>
                <td className="capitalize">{md.name}</td>
                <td>
                  <div className="flex gap-2 items-center">
                    <Upload
                      referenceNumber={referenceNumber}
                      onUpload={(e) => handleFileUpload(e, md.id, md.name)}
                    />
                    {uploadedMandatoryDocument[md.id] && (
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          handleDownloadFile(
                            uploadedMandatoryDocument[md.id].id
                          )
                        }
                      >
                        Download
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default UserDocument;
