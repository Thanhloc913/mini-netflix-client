import React, { useState } from 'react';

interface VideoTesterProps {
  urls: string[];
  onWorkingUrl?: (url: string) => void;
}

export function VideoTester({ urls, onWorkingUrl }: VideoTesterProps) {
  const [testResults, setTestResults] = useState<Record<string, 'testing' | 'success' | 'error'>>({});

  const testUrl = async (url: string) => {
    setTestResults(prev => ({ ...prev, [url]: 'testing' }));
    
    try {
      // Create a test video element
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      
      const promise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 10000); // 10 second timeout
        
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Video load error'));
        };
      });
      
      video.src = url;
      await promise;
      
      setTestResults(prev => ({ ...prev, [url]: 'success' }));
      onWorkingUrl?.(url);
      console.log('✅ Video URL works:', url);
      
    } catch (error) {
      setTestResults(prev => ({ ...prev, [url]: 'error' }));
      console.error('❌ Video URL failed:', url, error);
    }
  };

  const testAllUrls = async () => {
    for (const url of urls) {
      await testUrl(url);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-4">Video URL Tester</h3>
      
      <button
        onClick={testAllUrls}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        Test All URLs
      </button>
      
      <div className="space-y-2">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
            <div className="flex-1">
              <p className="text-white text-sm font-mono break-all">{url}</p>
            </div>
            <div className="flex items-center gap-2">
              {testResults[url] === 'testing' && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
              {testResults[url] === 'success' && (
                <div className="text-green-500 text-sm">✅ OK</div>
              )}
              {testResults[url] === 'error' && (
                <div className="text-red-500 text-sm">❌ Failed</div>
              )}
              <button
                onClick={() => testUrl(url)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs"
              >
                Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}