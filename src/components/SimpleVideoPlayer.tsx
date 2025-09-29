import React, { useRef, useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

interface SimpleVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onClose?: () => void;
}

export function SimpleVideoPlayer({ src, poster, title, onClose }: SimpleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    console.log('🎬 Setting up video player for:', src);
    
    // Check if it's HLS stream
    const isHLS = src.includes('.m3u8') || src.includes('hls');
    
    if (isHLS) {
      console.log('🎭 HLS stream detected, checking support...');
      
      // Check native HLS support (Safari)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('✅ Native HLS support detected');
        video.src = src;
      } else {
        console.log('🔄 Loading HLS.js for cross-browser support...');
        
        // Dynamic import HLS.js
        import('hls.js').then(({ default: Hls }) => {
          if (Hls.isSupported()) {
            console.log('✅ HLS.js supported, initializing...');
            const hls = new Hls({
              debug: false,
              enableWorker: false,
            });
            
            hls.loadSource(src);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log('✅ HLS manifest loaded successfully');
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
              console.error('❌ HLS error:', data);
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error('❌ Network error');
                    setError('Lỗi mạng khi tải video');
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error('❌ Media error');
                    setError('Lỗi media codec');
                    break;
                  default:
                    setError(`Lỗi HLS: ${data.details}`);
                    break;
                }
              }
            });

            // Cleanup function
            return () => {
              console.log('🧹 Cleaning up HLS.js');
              hls.destroy();
            };
          } else {
            console.error('❌ HLS.js not supported');
            setError('Trình duyệt không hỗ trợ HLS streaming');
          }
        }).catch((err) => {
          console.error('❌ Failed to load HLS.js:', err);
          setError('Không thể load HLS player');
        });
      }
    } else {
      console.log('🎬 Regular video file');
      video.src = src;
    }

    // Video event listeners
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      console.error('❌ Video error:', target.error);
      if (target.error) {
        setError(`Lỗi video: ${target.error.message}`);
      }
    };

    const handleLoadStart = () => {
      console.log('📡 Video load started');
      setError(null);
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);



  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('❌ Play failed:', err);
        setError(`Không thể phát video: ${err.message}`);
      });
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error('❌ Video error:', video.error);
    setError(`Lỗi video: ${video.error?.message || 'Unknown error'}`);
  };

  const handleLoadedData = () => {
    console.log('✅ Video loaded successfully');
    setError(null);
  };

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

      {/* Video container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={poster}
          controls
          onError={handleError}
          onLoadedData={handleLoadedData}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          <source src={src} type="application/vnd.apple.mpegurl" />
          Your browser does not support the video tag.
        </video>

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white p-6 max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">Lỗi phát video</h2>
              <p className="text-sm mb-4">{error}</p>
              <div className="text-xs text-gray-400 mb-4">
                <p>URL: {src}</p>
              </div>
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        {!isPlaying && !error && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
          >
            <div className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 rounded-full p-6 hover:scale-110 transition-all">
              <Play size={48} className="text-white fill-current" />
            </div>
          </button>
        )}

        {/* Debug info
        {import.meta.env.DEV && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
            <p>URL: {src}</p>
            <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
          </div>
        )} */}
      </div>
    </div>
  );
}