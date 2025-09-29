import { useParams, useNavigate } from "react-router-dom";
import { useMovie } from "@/hooks/queries/useMovieQueries";
import { Button } from "@/components/ui/button";
import { Play, Plus, ArrowLeft, Calendar, Clock, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);
  
  const { data: movie, isLoading, error } = useMovie(id || "");

  const handleWatchNow = () => {
    if (id) {
      navigate(`/watch/${id}`);
    }
  };

  useEffect(() => {
    // Simple entrance animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(-1);
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không tìm thấy phim</p>
          <Button onClick={handleBack} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black transition-all duration-500 ${
      isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${movie.posterUrl || "https://via.placeholder.com/1920x1080"})` 
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative z-20 h-full flex items-end">
          <div className="container mx-auto px-6 md:px-12 pb-12">
            <div className="max-w-4xl">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {movie.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-lg">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-5 w-5" />
                    <span>{movie.duration}p</span>
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  movie.isSeries ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                }`}>
                  {movie.isSeries ? "Phim bộ" : "Phim lẻ"}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre: any, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-700/80 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name || genre}
                  </span>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-3"
                  onClick={handleWatchNow}
                >
                  <Play className="h-6 w-6 fill-current" />
                  Xem ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-6 py-3 text-lg font-semibold flex items-center gap-3"
                >
                  <Plus className="h-6 w-6" />
                  Danh sách của tôi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Nội dung phim</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Cast */}
            {movie.casts && movie.casts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Diễn viên
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.casts.slice(0, 6).map((cast: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-white font-medium">{cast.name}</p>
                      <p className="text-gray-400 text-sm">{cast.role || "Diễn viên"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Poster */}
            <div className="mb-8">
              <img
                src={movie.posterUrl || "https://via.placeholder.com/300x450"}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Additional Info */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Thông tin phim</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Năm phát hành:</span>
                  <span className="text-white ml-2">{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Thời lượng:</span>
                  <span className="text-white ml-2">{movie.duration || "N/A"} phút</span>
                </div>
                <div>
                  <span className="text-gray-400">Đánh giá:</span>
                  <span className="text-yellow-400 ml-2 font-semibold">{movie.rating}/10</span>
                </div>
                <div>
                  <span className="text-gray-400">Loại:</span>
                  <span className="text-white ml-2">{movie.isSeries ? "Phim bộ" : "Phim lẻ"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}