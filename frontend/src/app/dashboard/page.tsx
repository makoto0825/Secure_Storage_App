"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  deleteFileFromServer,
  downloadFileFromServer,
  fetchFileListFromServer,
} from "@/app/services/fileService";

import { Heading } from "@/app/components/heading";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/table";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/app/components/dropdown";
import { UploadFile } from "./components/UploadFile";

interface FileItem {
  name: string;
  uploadedAt?: string;
  uploadedBy?: string;
  size?: string;
}

const formatFileSize = (bytes: string): string => {
  const parsedBytes = parseInt(bytes, 10);
  if (isNaN(parsedBytes)) return "Unknown";
  const KB = 1024;
  const MB = KB * 1024;

  if (parsedBytes < KB) {
    return `${parsedBytes} Bytes`;
  } else if (parsedBytes < MB) {
    return `${(parsedBytes / KB).toFixed(2)} KB`;
  } else {
    return `${(parsedBytes / MB).toFixed(2)} MB`;
  }
};

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);

  const fetchFileList = async () => {
    setLoading(true);
    try {
      const files = await fetchFileListFromServer();
      setFiles(files);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, [router]);

  const handleDownload = async (fileName: string) => {
    try {
      await downloadFileFromServer(fileName);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to download file");
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const res = await deleteFileFromServer(fileName);

      if (res) {
        alert("File deleted successfully");
        fetchFileList(); // Refresh file list
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting file");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Files</Heading>
        <div className="flex gap-4">
          <UploadFile onFileUploaded={() => fetchFileList()} />
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Uploaded At</TableHeader>
            <TableHeader>Uploaded By</TableHeader>
            <TableHeader>Size</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>
                {file.uploadedAt
                  ? format(new Date(file.uploadedAt), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </TableCell>
              <TableCell className="text-zinc-500">
                {file.uploadedBy || "Unknown"}
              </TableCell>
              <TableCell>{formatFileSize(file.size) || "Unknown"}</TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem onClick={() => handleDownload(file.name)}>
                        Download
                      </DropdownItem>
                      <DropdownItem
                        className="text-red-500! hover:text-white! hover:bg-red-500!"
                        onClick={() => handleDelete(file.name)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default DashboardPage;
