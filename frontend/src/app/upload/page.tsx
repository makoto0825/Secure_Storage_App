'use client';

import { useState, useEffect } from 'react';
import { supabase } from "@/app/util/supabaseClient";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is logged in using Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Check if user is logged in using Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/signin");
        return;
      }

      // Send POST request to Django /upload/ with file and access token
      const res = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Uploaded Successfully")
    } catch (error) {
      console.error("Upload error", error);
      setMessage("Upload Error");
    }
  };

  return (
    <main className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Test Upload File</h1>
      <form onSubmit={handleUpload} className='flex flex-col gap-4'>
        <input
          className='border border-gray-300 p-2 rounded'
          type='file'
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded border border-blue-500 hover:bg-blue-600'
        >
          Submit
        </button>
      </form>
      {message && <p className='mt-4 text-green-600'>{message}</p>}
    </main>
  );
}
