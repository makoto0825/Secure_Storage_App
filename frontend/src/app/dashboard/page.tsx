"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/util/supabaseClient";
import axios from "axios";

import { Heading } from "@/app/components/heading";
import { Button } from "@/app/components/button";
import {
  ArrowUpOnSquareIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/16/solid";
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
import { format } from "date-fns";

interface FileItem {
  name: string,
  uploadedAt?: string,
  uploadedBy?: string,
  size?: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);

  // Fetch file list
  const fetchFileList = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/signin");
        return;
      }

      // Fetch file list
      console.log(session?.access_token)
      const res = await axios.get("http://localhost:8000/getFiles", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Receive metadata of files
      setFiles(res.data.files || []);
    } catch (error) {
      console.error("Error fetching file list", error);
      alert("Error retrieving file list");
    } finally {
      setLoading(false);
    }
  };

  // Call once on mount
  useEffect(() => {
    fetchFileList();
  }, [router]);

  // Download function
  const handleDownload = async (fileName: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/signin");
        return;
      }

      // Send GET request to /download endpoint with Authorization
      const res = await axios.get(
        `http://localhost:8000/download/?file=${encodeURIComponent(fileName)}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      // Trigger file download on client side
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Error", error);
      alert('Download Error');
    }
  };

  // DELETE function
  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/signin");
        return;
      }

      // Send DELETE request to Django backend
      // Django backend will extract user_id from JWT and forward the request
      const res = await axios.delete(
        `http://localhost:8000/delete/?file=${encodeURIComponent(fileName)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (res.status === 200) {
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
          <Button outline onClick={() => router.push("/upload")}>
            <ArrowUpOnSquareIcon/>
            Upload File
          </Button>
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
              <TableCell className="text-zinc-500">{file.uploadedBy || "Unknown"}</TableCell>
              <TableCell>{file.size || "Unknown"}</TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem
                        onClick={() => handleDownload(file.name)}
                      >
                        Download</DropdownItem>
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
