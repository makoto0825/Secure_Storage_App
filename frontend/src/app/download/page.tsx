'use client';

import React, { useEffect, useState } from 'react';

const DownloadPage = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ファイル一覧を取得
  const fetchFileList = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/getFiles'); // ← Djangoのエンドポイントに合わせて
      if (!res.ok) {
        throw new Error('ファイル一覧の取得に失敗しました');
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
      alert('ファイル一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, []);

  // ファイルをダウンロードする処理
  const handleDownload = async (fileName: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/download/?file=${encodeURIComponent(fileName)}`
      );
      if (!res.ok) throw new Error('ファイル取得に失敗しました');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('ダウンロード失敗');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ファイル一覧</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : files.length === 0 ? (
        <p>ファイルが見つかりません。</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file} style={{ marginBottom: '0.5rem' }}>
              {file}{' '}
              <button
                onClick={() => handleDownload(file)}
                style={{ marginLeft: '1rem' }}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200'
              >
                ダウンロード
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DownloadPage;
