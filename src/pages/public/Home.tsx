import { useMovies } from "@/hooks/useMovies";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import type { Movie } from "@/types/movie";

export default function Home() {
    const { featuredMovies, movieCategories, isLoading, error, refetch } = useMovies();

    const handleMoviePlay = (movie: Movie) => {
        // TODO: Implement movie player or navigation
        console.log("Playing movie:", movie.title);
        alert(`Đang phát: ${movie.title}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <div className="text-white text-xl">Đang tải anime...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Lỗi: {error.message || 'Có lỗi xảy ra'}</div>
                    <button
                        onClick={() => refetch()}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section - Always show if we have movies */}
            <HeroSection movies={featuredMovies} onPlay={handleMoviePlay} />

            {/* Gradient Transition */}
            <div className="h-32 bg-gradient-to-b from-black via-gray-800 to-gray-900"></div>

            {/* Movie Categories */}
            <div className="bg-gray-900 px-6 md:px-12 py-8 space-y-8">
                {/* Featured section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Những anime mới và đang phát hành tại đây!
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Khám phá thế giới anime đa dạng với những bộ phim mới nhất và hot nhất
                    </p>
                </div>

                {movieCategories.length > 0 ? (
                    movieCategories.map((category) => (
                        <div key={category.id} className="mb-10">
                            <MovieRow
                                title={category.name}
                                movies={category.movies}
                                onMoviePlay={handleMoviePlay}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">Đang tải phim...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
