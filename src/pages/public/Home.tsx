import { useNavigate } from "react-router-dom";
import { useMovies } from "@/hooks/useMovies";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import type { Movie } from "@/types/movie";

export default function Home() {
    const { featuredMovies, movieCategories, isLoading, error, refetch } = useMovies();
    const navigate = useNavigate();

    const handleMoviePlay = (movie: Movie) => {
        console.log("Playing movie:", movie.title);
        navigate(`/watch/${movie.id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto"></div>
                        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-orange-300/10 border-r-orange-300 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-white text-xl font-semibold">Đang tải anime...</div>
                        <div className="text-gray-400 text-sm">Chuẩn bị những bộ phim tuyệt vời cho bạn</div>
                    </div>

                    {/* Loading dots animation */}
                    <div className="flex justify-center gap-1 mt-6">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Oops! Có lỗi xảy ra</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {error.message || 'Không thể tải dữ liệu anime. Vui lòng thử lại sau.'}
                        </p>
                    </div>

                    <button
                        onClick={() => refetch()}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-500/25"
                    >
                        Thử lại
                    </button>

                    <div className="mt-6 text-xs text-gray-500">
                        Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section với gradient overlay liền mạch */}
            <div className="relative">
                <HeroSection movies={featuredMovies} onPlay={handleMoviePlay} />

                {/* Gradient overlay từ từ xuống - giống Ninoyo */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-10"></div>
            </div>

            {/* Content section - liền mạch không có gap */}
            <div className="relative -mt-16 pt-16 bg-black">
                {/* Featured Movies Section Header */}
                <div className="px-6 md:px-12 pt-2 pb-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                                Mới Phát Hành
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Những anime mới và đang phát hành tại đây!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Movie Categories */}
                <div className="px-6 md:px-12 pb-12">
                    <div className="max-w-7xl mx-auto">
                        {movieCategories.length > 0 ? (
                            <div className="space-y-8">
                                {movieCategories.map((category, index) => (
                                    <div
                                        key={category.id}
                                        className="opacity-0 animate-fade-in"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                            animationFillMode: 'forwards'
                                        }}
                                    >
                                        <MovieRow
                                            title={category.name}
                                            movies={category.movies}
                                            onMoviePlay={handleMoviePlay}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="space-y-6">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="h-5 bg-gray-800 rounded w-40 mx-auto mb-4"></div>
                                            <div className="flex gap-3 justify-center overflow-hidden">
                                                {[...Array(6)].map((_, j) => (
                                                    <div key={j} className="w-24 h-36 bg-gray-800 rounded-lg flex-shrink-0"></div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
