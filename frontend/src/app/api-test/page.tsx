'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [healthResponse, setHealthResponse] = useState<{
    error?: string;
  } | null>(null);
  const [testResponse, setTestResponse] = useState<{ error?: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Hello from Next.js!');

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/health/');
      const data = await response.json();
      setHealthResponse(data);
    } catch (error) {
      setHealthResponse({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const testPostApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setTestResponse(data);
    } catch (error) {
      setTestResponse({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Django API 疎通確認
        </h1>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Health Check */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>Health Check (GET)</h2>
            <button
              onClick={testHealthCheck}
              disabled={loading}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Test Health Check'}
            </button>

            {healthResponse && (
              <div className='mt-4'>
                <h3 className='font-semibold mb-2'>Response:</h3>
                <pre className='bg-gray-100 p-3 rounded text-sm overflow-auto'>
                  {JSON.stringify(healthResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Test API */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>Test API (POST)</h2>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Message:</label>
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={testPostApi}
              disabled={loading}
              className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Test POST API'}
            </button>

            {testResponse && (
              <div className='mt-4'>
                <h3 className='font-semibold mb-2'>Response:</h3>
                <pre className='bg-gray-100 p-3 rounded text-sm overflow-auto'>
                  {JSON.stringify(testResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>接続状況</h2>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
              <span>Next.js: http://localhost:3000</span>
            </div>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-blue-500 rounded-full mr-3'></div>
              <span>Django: http://127.0.0.1:8000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
