import { useState } from "react";
import { Button } from "@/app/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/components/dialog";
import { ErrorMessage, Field } from "@/app/components/fieldset";
import { Input } from "@/app/components/input";
import { ArrowUpOnSquareIcon } from "@heroicons/react/16/solid";
import { uploadFileToServer } from "@/app/services/fileService";

type Props = {
  onFileUploaded: () => void;
};

export const UploadFile = ({ onFileUploaded }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const res = await uploadFileToServer(file);

      if (res.status !== "success") {
        throw new Error("Failed to upload file");
      }

      alert("File uploaded successfully");
      setIsOpen(false);
      setFile(null);
      onFileUploaded();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Upload failed");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button outline onClick={() => setIsOpen(true)}>
        <ArrowUpOnSquareIcon />
        Upload File
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogDescription>Please select a file to upload.</DialogDescription>
        <DialogBody>
          <Field>
            <Input type="file" name="file" onChange={handleFileChange} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
