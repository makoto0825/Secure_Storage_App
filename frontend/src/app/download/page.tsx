'use client';

import React from 'react';

const DownloadPage = () => {
  const handleDownload = async () => {
    try {
      const res = await fetch('http://localhost:8000/download/', {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('ファイル取得に失敗しました');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'makoto.txt'; // 任意のファイル名
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('ダウンロード失敗');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ファイルダウンロード</h1>
      <button onClick={handleDownload} style={{ padding: '0.5rem 1rem' }}>
        Download makoto.txt
      </button>
    </div>
  );
};

export default DownloadPage;
