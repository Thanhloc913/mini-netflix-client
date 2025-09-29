import React, { useState } from 'react';
import { SimpleVideoPlayer } from '@/components/SimpleVideoPlayer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoTester } from '@/components/VideoTester';

export function VideoTest() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  const testUrls = [
    {
      name: 'Demo MP4 (Big Buck Bunny)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'mp4'
    },
    {
      name: 'Demo HLS Stream',
      url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      type: 'hls'
    },
    {
      name: 'Apple HLS Demo',
      url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
      type: 'hls'
    }
  ];

  const handlePlay = (url: string) => {
    setSelectedUrl(url);
    setShowPlayer(true);
  };

  const handleClose = () => {
    setShowPlayer(false);
    setSelectedUrl('');
  };

  if (showPlayer && selectedUrl) {
    const PlayerComponent = useAdvanced ? VideoPlayer : SimpleVideoPlayer;
    return (
      <PlayerComponent
        src={selectedUrl}
        title="Test Video"
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Video Player Test</h1>
        
        <div className="mb-6">
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={useAdvanced}
              onChange={(e) => setUseAdvanced(e.target.checked)}
              className="mr-2"
            />
            Use Advanced Player (with HLS.js)
          </label>
        </div>

        <div className="grid gap-4">
          {testUrls.map((video, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">{video.name}</h3>
              <p className="text-gray-400 text-sm mb-3">Type: {video.type.toUpperCase()}</p>
              <p className="text-gray-500 text-xs mb-3 break-all">{video.url}</p>
              <button
                onClick={() => handlePlay(video.url)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Play Video
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Custom URL Test</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter video URL..."
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const url = (e.target as HTMLInputElement).value;
                  if (url) handlePlay(url);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input?.value) handlePlay(input.value);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Test
            </button>
          </div>
        </div>

        <div className="mt-8">
          <VideoTester
            urls={testUrls.map(v => v.url)}
            onWorkingUrl={(url) => {
              console.log('Found working URL:', url);
            }}
          />
        </div>
      </div>
    </div>
  );
}