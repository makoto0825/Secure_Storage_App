"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/util/supabaseClient";

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

const MOCK_FILES = [
  {
    id: 1,
    name: "File 1",
    uploadedAt: "2023-01-01",
    uploadedBy: "User 1",
    size: "1 MB",
  },
  {
    id: 2,
    name: "File 2",
    uploadedAt: "2023-01-02",
    uploadedBy: "User 2",
    size: "2 MB",
  },
  {
    id: 3,
    name: "File 3",
    uploadedAt: "2023-01-03",
    uploadedBy: "User 3",
    size: "3 MB",
  },
];

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/signin");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Checking session...
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Files</Heading>
        <div className="flex gap-4">
          <Button outline>
            <ArrowUpOnSquareIcon />
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
          {MOCK_FILES.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>
                {format(file.uploadedAt, "MMM dd, yyyy HH:mm")}
              </TableCell>
              <TableCell className="text-zinc-500">{file.uploadedBy}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem>Download</DropdownItem>
                      <DropdownItem className="text-red-500! hover:text-white! hover:bg-red-500!">
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
