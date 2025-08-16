import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import axios from "axios";
import React from "react";

function Download({ fileId }) {
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
    <Button variant={"outline"} onClick={() => handleDownloadFile(fileId)}>
      Download
    </Button>
  );
}

export default Download;
