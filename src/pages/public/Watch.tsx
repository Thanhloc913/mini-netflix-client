import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovie } from '@/hooks/queries/useMovieQueries';
import { useVideoAssets, useHLSAssets } from '@/hooks/queries/useVideoQueries';
import { SimpleVideoPlayer } from '@/components/SimpleVideoPlayer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Settings, Maximize } from 'lucide-react';
import type { VideoAsset } from '@/apis/movies';

export function Watch() {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState(1);
    const [availableQualities, setAvailableQualities] = useState<VideoAsset[]>([]);

    // Fetch data
    const { data: movie, isLoading: movieLoading } = useMovie(movieId || '');
    const { data: hlsAssets, isLoading: hlsLoading } = useHLSAssets(movieId || '');
    const { data: videoAssets, isLoading: videoLoading } = useVideoAssets(movieId || '');

    const loading = movieLoading || hlsLoading || videoLoading;

    // Demo episodes for UI
    const episodes = Array.from({ length: 13 }, (_, i) => ({
        number: i + 1,
        title: `Tập ${i + 1}`,
        duration: '24:01',
        thumbnail: movie?.posterUrl || 'https://via.placeholder.com/160x90'
    }));

    useEffect(() => {
        if (!movieId) {
            navigate('/');
            return;
        }
    }, [movieId, navigate]);

    useEffect(() => {
        console.log('🔍 Selecting video asset from API data...');
        
        // Combine all available video assets for quality selection
        const allAssets = [...(hlsAssets || []), ...(videoAssets || [])];
        setAvailableQualities(allAssets);
        
        // Select the best available video asset from API
        if (hlsAssets && hlsAssets.length > 0) {
            console.log('✅ Found HLS assets from API:', hlsAssets);
            const bestAsset = hlsAssets.reduce((best, current) => {
                const bestRes = parseInt(best.resolution.replace('p', ''));
                const currentRes = parseInt(current.resolution.replace('p', ''));
                return currentRes > bestRes ? current : best;
            });
            console.log('🎯 Selected HLS asset:', bestAsset);
            setSelectedAsset(bestAsset);
        } else if (videoAssets && videoAssets.length > 0) {
            console.log('✅ Found video assets from API:', videoAssets);
            const bestAsset = videoAssets.reduce((best, current) => {
                const bestRes = parseInt(best.resolution.replace('p', ''));
                const currentRes = parseInt(current.resolution.replace('p', ''));
                return currentRes > bestRes ? current : best;
            });
            console.log('🎯 Selected video asset:', bestAsset);
            setSelectedAsset(bestAsset);
        } else if (!loading && movie) {
            console.log('⚠️ No video assets found from API for movie:', movie.id);
            setSelectedAsset(null);
        }
    }, [hlsAssets, videoAssets, loading, movie]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEpisodeSelect = (episodeNumber: number) => {
        setCurrentEpisode(episodeNumber);
        // In real app, this would load different video asset for the episode
    };

    const handleQualityChange = (asset: VideoAsset) => {
        console.log('🎯 Quality changed to:', asset.resolution);
        setSelectedAsset(asset);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p>Đang tải video...</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy phim</h2>
                    <Button onClick={handleBack} variant="outline">
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            className="text-white hover:bg-white/20"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">Ninoyo</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span>Kaoru Hana wa Rin...</span>
                                <span>›</span>
                                <span>Episode {currentEpisode}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Maximize className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Video Player Container */}
            <div className="relative h-[70vh] bg-black">
                {selectedAsset ? (
                    <SimpleVideoPlayer
                        src={selectedAsset.url}
                        poster={movie.posterUrl}
                        title={`${movie.title} - Tập ${currentEpisode}`}
                        videoAssets={availableQualities}
                        selectedAsset={selectedAsset}
                        onClose={handleBack}
                        onQualityChange={handleQualityChange}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Play className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                            <p className="text-gray-400 mb-2">Video chưa sẵn sàng</p>
                            <p className="text-sm text-gray-500">
                                Video đang được xử lý hoặc chưa được upload
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Movie Info */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Movie Details */}
                        <div className="lg:col-span-2">
                            <div className="mb-4">
                                <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    Season 1
                                </span>
                                <p className="text-gray-300 text-sm">
                                    Lượt xem: 18/30
                                </p>
                            </div>
                            
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {movie.description}
                            </p>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genres?.map((genre: any, index: number) => (
                                    <span
                                        key={index}
                                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                                    >
                                        {genre.name || genre}
                                    </span>
                                ))}
                            </div>

                            {/* Additional Info */}
                            <div className="text-sm text-gray-400 space-y-1">
                                <p>📺 Ninoyo là website phi lợi nhuận. Quảng cáo hoàn toàn bằng một tài khoản của Yukano Nino.</p>
                                <p>📝 Do chí có một người nên không có nhiều thời gian upload phim, vui lòng không quá thô có lập mức.</p>
                                <p>🤖 Robot Telegram Ninoyo để có thể tăng lượng tỉ website này.</p>
                            </div>
                        </div>

                        {/* Right: Server Selection */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className="text-orange-500">🌐</span>
                                    Tập trước
                                </h3>
                                <div className="space-y-2">
                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                        Tập tiếp theo
                                    </Button>
                                    <div className="text-sm text-gray-400 space-y-1">
                                        <p>🔄 Tắt đèn</p>
                                        <p>💾 Báo lỗi</p>
                                        <p>🖥️ Server: 8bit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Episodes List */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Danh sách tập phim</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 2xl:grid-cols-13 gap-3">
                        {episodes.map((episode) => (
                            <Card
                                key={episode.number}
                                className={`cursor-pointer transition-all duration-200 border ${
                                    currentEpisode === episode.number
                                        ? 'bg-orange-600 border-orange-500 text-white'
                                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
                                }`}
                                onClick={() => handleEpisodeSelect(episode.number)}
                            >
                                <div className="p-3 text-center">
                                    <div className="text-lg font-bold mb-1">{episode.number}</div>
                                    <div className="text-xs opacity-80">{episode.duration}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Comments Section Placeholder */}
                <div className="mt-12">
                    <h3 className="text-xl font-bold mb-4">Bình luận</h3>
                    <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
                        <p>Tính năng bình luận sẽ được thêm trong phiên bản tiếp theo</p>
                    </div>
                </div>
            </div>
        </div>
    );
}