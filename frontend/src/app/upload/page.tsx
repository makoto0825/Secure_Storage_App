'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || 'アップロードに失敗しました');
    } catch {
      setMessage('ファイルのアップロード中にエラーが発生しました');
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
          submit
        </button>
      </form>
      {message && <p className='mt-4 text-green-600'>{message}</p>}
    </main>
  );
}
