import { useState, useEffect } from 'react';

interface VideoDebuggerProps {
  url: string;
}

export function VideoDebugger({ url }: VideoDebuggerProps) {
  const [status, setStatus] = useState<'checking' | 'accessible' | 'cors-error' | 'not-found' | 'error'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    checkVideoUrl();
  }, [url]);

  const checkVideoUrl = async () => {
    setStatus('checking');
    
    try {
      // First, try a HEAD request to check if URL is accessible
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'cors'
      });
      
      if (response.ok) {
        setStatus('accessible');
        setDetails(`Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
      } else {
        setStatus('not-found');
        setDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('CORS')) {
        setStatus('cors-error');
        setDetails('CORS policy blocks this request');
      } else {
        setStatus('error');
        setDetails(error.message);
      }
    }
  };

  const testWithVideo = () => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      setStatus('accessible');
      setDetails(`Video loaded: ${video.duration}s duration, ${video.videoWidth}x${video.videoHeight}`);
    };
    
    video.onerror = () => {
      setStatus('error');
      setDetails(`Video element error: ${video.error?.message || 'Unknown'}`);
    };
    
    video.src = url;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'accessible': return 'text-green-500';
      case 'checking': return 'text-yellow-500';
      case 'cors-error': return 'text-orange-500';
      case 'not-found': return 'text-red-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'accessible': return '✅';
      case 'checking': return '⏳';
      case 'cors-error': return '🚫';
      case 'not-found': return '❌';
      case 'error': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-2">Video URL Debugger</h3>
      
      <div className="mb-2">
        <p className="text-gray-300 text-sm break-all">{url}</p>
      </div>
      
      <div className={`mb-2 ${getStatusColor()}`}>
        <p className="text-sm">
          {getStatusIcon()} Status: {status}
        </p>
        {details && <p className="text-xs mt-1">{details}</p>}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={checkVideoUrl}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Check URL
        </button>
        <button
          onClick={testWithVideo}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Test Video Element
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
        >
          Open Direct
        </a>
      </div>
    </div>
  );
}