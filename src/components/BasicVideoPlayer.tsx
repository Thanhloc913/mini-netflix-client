import React from 'react';
import { X } from 'lucide-react';

interface BasicVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onClose?: () => void;
}

export function BasicVideoPlayer({ src, poster, title, onClose }: BasicVideoPlayerProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 p-2"
      >
        <X size={24} />
      </button>

      {/* Title */}
      {title && (
        <div className="absolute top-4 left-4 z-10 text-white text-lg font-semibold">
          {title}
        </div>
      )}

      {/* Basic HTML5 Video */}
      <video
        className="w-full h-full object-contain"
        controls
        autoPlay
        poster={poster}
        onError={(e) => {
          console.error('❌ Basic video error:', e);
        }}
        onLoadStart={() => {
          console.log('🎬 Basic video load started');
        }}
        onLoadedData={() => {
          console.log('✅ Basic video loaded');
        }}
        onCanPlay={() => {
          console.log('✅ Basic video can play');
        }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="application/vnd.apple.mpegurl" />
        <p className="text-white text-center">
          Your browser does not support the video tag.
          <br />
          <a href={src} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
            Download video
          </a>
        </p>
      </video>

      {/* Debug info */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
        <p>URL: {src}</p>
        <p>Basic HTML5 Video Player</p>
      </div>
    </div>
  );
}