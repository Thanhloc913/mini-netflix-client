import { useRef, useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { QualitySelector } from '@/components/QualitySelector';
import type { VideoAsset } from '@/apis/movies';

interface SimpleVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  videoAssets?: VideoAsset[];
  selectedAsset?: VideoAsset | null;
  onClose?: () => void;
  onQualityChange?: (asset: VideoAsset) => void;
}

export function SimpleVideoPlayer({ 
  src, 
  poster, 
  title, 
  videoAssets = [], 
  selectedAsset, 
  onClose, 
  onQualityChange 
}: SimpleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [wasPlaying, setWasPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      console.log('🧹 Cleaning up previous HLS instance');
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

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
            
            // Store HLS instance for cleanup
            hlsRef.current = hls;
            
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
                    console.error('❌ Media error, trying to recover...');
                    hls.recoverMediaError();
                    break;
                  default:
                    setError(`Lỗi HLS: ${data.details}`);
                    break;
                }
              }
            });

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
      
      // Cleanup HLS instance on unmount
      if (hlsRef.current) {
        console.log('🧹 Cleaning up HLS instance on unmount');
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // Handle quality change while preserving currentTime
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastUpdate = 0;
    const handleTimeUpdate = () => {
      // Throttle updates to every 500ms to reduce re-renders
      const now = Date.now();
      if (now - lastUpdate > 500) {
        setCurrentTime(video.currentTime);
        lastUpdate = now;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Preserve currentTime and playing state when src changes (quality change)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentTime <= 0) return;

    let restored = false;
    
    const restorePlayback = () => {
      if (restored) return; // Prevent multiple calls
      restored = true;
      
      console.log('🔄 Restoring playback to time:', currentTime);
      
      setTimeout(() => {
        if (video.duration && currentTime <= video.duration && currentTime > 0) {
          video.currentTime = currentTime;
          
          if (wasPlaying && video.paused) {
            video.play().then(() => {
              console.log('✅ Playback resumed successfully');
            }).catch((err) => {
              console.error('❌ Failed to resume playback:', err);
            });
          }
        }
      }, 200); // Increased delay for HLS
    };

    // Single event listener approach
    const handleCanPlay = () => {
      restorePlayback();
      video.removeEventListener('canplay', handleCanPlay);
    };

    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
      restorePlayback();
    } else {
      video.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]); // Only depend on src, not currentTime/wasPlaying to avoid loops

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

  const handleQualityChange = (asset: VideoAsset) => {
    const video = videoRef.current;
    if (video && onQualityChange) {
      // Save current playback state only if video is playing/loaded
      if (video.readyState >= 1 && video.currentTime > 0) {
        setCurrentTime(video.currentTime);
        setWasPlaying(!video.paused && !video.seeking);
        console.log('🎯 Changing quality to:', asset.resolution, 'at time:', video.currentTime, 'wasPlaying:', !video.paused);
      }
      
      // Call parent's quality change handler
      onQualityChange(asset);
    }
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
          onPlay={() => {
            setIsPlaying(true);
            setWasPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
            setWasPlaying(false);
          }}
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

        {/* Quality Selector */}
        {videoAssets.length > 0 && onQualityChange && (
          <div className="absolute bottom-16 right-4 z-10">
            <QualitySelector
              videoAssets={videoAssets}
              selectedAsset={selectedAsset || null}
              onQualityChange={handleQualityChange}
            />
          </div>
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