import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRef } from "react";
import { toast } from "sonner";

function FileUploadButton() {
  const fileInputRef = useRef(null);

  function handleClick() {
    fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    try {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      console.log(data);
      toast.success("Success", { description: "File Uploaded successfully" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div>
      <Button variant="default" onClick={handleClick}>
        Upload
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUploadButton;
