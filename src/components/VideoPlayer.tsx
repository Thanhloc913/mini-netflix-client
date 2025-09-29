import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onClose?: () => void;
}

export function VideoPlayer({ src, poster, title, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 VideoPlayer: Loading video source:', src);
    setIsLoading(true);
    setError(null);

    // Check if the URL is an HLS stream (.m3u8)
    const isHLS = src.includes('.m3u8') || src.includes('hls');
    
    if (isHLS) {
      console.log('🎬 Detected HLS stream, checking support...');
      
      // Check if HLS is natively supported (Safari)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('✅ Native HLS support detected');
        video.src = src;
        setIsLoading(false);
      } else {
        console.log('🔄 Loading HLS.js for HLS support...');
        // Try to load HLS.js for other browsers
        import('hls.js').then(({ default: Hls }) => {
          if (Hls.isSupported()) {
            console.log('✅ HLS.js supported, initializing...');
            const hls = new Hls({
              debug: true,
              enableWorker: false,
            });
            
            hls.loadSource(src);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log('✅ HLS manifest loaded successfully');
              setIsLoading(false);
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
              console.error('❌ HLS error:', data);
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error('❌ Network error, trying to recover...');
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error('❌ Media error, trying to recover...');
                    hls.recoverMediaError();
                    break;
                  default:
                    console.error('❌ Fatal error, cannot recover');
                    setError(`Lỗi phát video HLS: ${data.details}`);
                    setIsLoading(false);
                    break;
                }
              }
            });

            return () => {
              console.log('🧹 Cleaning up HLS.js');
              hls.destroy();
            };
          } else {
            console.error('❌ HLS.js not supported');
            setError('Trình duyệt không hỗ trợ phát video HLS');
            setIsLoading(false);
          }
        }).catch((err) => {
          console.error('❌ Failed to load HLS.js:', err);
          // Fallback to direct video source
          console.log('🔄 Fallback to direct video source');
          video.src = src;
          setIsLoading(false);
        });
      }
    } else {
      console.log('🎬 Regular video file, loading directly...');
      // Regular video file
      video.src = src;
      setIsLoading(false);
    }

    const handleLoadedMetadata = () => {
      console.log('✅ Video metadata loaded, duration:', video.duration);
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      console.log('▶️ Video started playing');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('⏸️ Video paused');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      const target = e.target as HTMLVideoElement;
      
      if (target.error) {
        console.error('❌ Video error details:', target.error);
        
        // Try fallback URLs if available
        const fallbackUrls = [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        ];
        
        if (retryCount < fallbackUrls.length) {
          console.log(`🔄 Trying fallback URL ${retryCount + 1}:`, fallbackUrls[retryCount]);
          target.src = fallbackUrls[retryCount];
          setRetryCount(prev => prev + 1);
          setIsLoading(true);
          return;
        }
        
        setError(`Lỗi phát video: ${target.error.message || 'Unknown error'}`);
      } else {
        setError('Không thể phát video. Vui lòng thử lại sau.');
      }
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      console.log('✅ Video can start playing');
      setIsLoading(false);
      
      // Auto-play when ready (with user gesture requirement handling)
      if (video && !isPlaying) {
        video.play().then(() => {
          console.log('✅ Auto-play started');
          setIsPlaying(true);
        }).catch((err) => {
          console.log('⚠️ Auto-play blocked (user interaction required):', err.message);
          // This is normal - browsers block auto-play without user interaction
        });
      }
    };

    const handleWaiting = () => {
      console.log('⏳ Video is buffering...');
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log('▶️ Video is playing');
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl"
      >
        ✕
      </button>

      {/* Video container */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={poster}
          onClick={togglePlay}
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-90 text-white p-6 rounded-lg text-center max-w-md">
              <p className="text-lg mb-2">⚠️ Lỗi phát video</p>
              <p className="text-sm mb-4">{error}</p>
              <div className="text-xs text-gray-400 mb-4">
                <p>Video URL: {src}</p>
                <p>HLS Support: {videoRef.current?.canPlayType('application/vnd.apple.mpegurl') ? 'Yes' : 'No'}</p>
                <p>Retry Count: {retryCount}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      setError(null);
                      setIsLoading(true);
                      setRetryCount(0);
                      videoRef.current.load();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                >
                  Thử lại
                </button>
                <button
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Large play button overlay when not playing */}
        {!isPlaying && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-6 transition-all transform hover:scale-110"
            >
              <Play size={64} className="text-white fill-current" />
            </button>
          </div>
        )}

        {/* Controls overlay */}
        {showControls && !isLoading && !error && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {/* Title */}
            {title && (
              <div className="text-white text-lg font-semibold mb-4">
                {title}
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-white text-sm mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Skip back */}
                <button
                  onClick={() => skip(-10)}
                  className="text-white hover:text-gray-300"
                >
                  <SkipBack size={24} />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>

                {/* Skip forward */}
                <button
                  onClick={() => skip(10)}
                  className="text-white hover:text-gray-300"
                >
                  <SkipForward size={24} />
                </button>

                {/* Volume controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}