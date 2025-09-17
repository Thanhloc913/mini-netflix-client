import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { moviesApi } from "@/apis/movies";
import type { Movie } from "@/types/movie";
import { Plus, Film, Eye, Edit, Trash2, Upload, Play, Clock, Calendar } from "lucide-react";

export default function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moviesApi.getAllMovies(1, 50);
      setMovies(response.movies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (_movieId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phim này?")) return;
    
    try {
      // TODO: Implement delete API
      alert("Chức năng xóa phim đang phát triển");
    } catch (err) {
      alert("Lỗi xóa phim");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải danh sách phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý phim</h1>
          <p className="text-gray-400">Quản lý tất cả phim trong hệ thống</p>
        </div>
        <Link to="/admin/movies/upload">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload phim mới
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600/30 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchMovies}
            className="mt-2 px-3 py-1 text-sm border border-red-600/50 text-red-400 hover:bg-red-600/10 rounded"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tổng phim</p>
              <p className="text-2xl font-bold text-white">{movies.length}</p>
            </div>
            <Film className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Phim bộ</p>
              <p className="text-2xl font-bold text-white">
                {movies.filter(m => m.isSeries).length}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Phim lẻ</p>
              <p className="text-2xl font-bold text-white">
                {movies.filter(m => !m.isSeries).length}
              </p>
            </div>
            <Film className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Đánh giá cao</p>
              <p className="text-2xl font-bold text-white">
                {movies.filter(m => parseFloat(m.rating) >= 8).length}
              </p>
            </div>
            <Upload className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Film className="w-5 h-5" />
            Danh sách phim ({movies.length})
          </h2>
        </div>
        <div className="p-6">
          {movies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Chưa có phim nào</h3>
              <p className="text-gray-500 mb-4">Hãy upload phim đầu tiên của bạn</p>
              <Link to="/admin/movies/upload">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Upload phim ngay
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-24 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {movie.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                        {movie.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {movie.duration} phút
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          movie.isSeries 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-blue-600/20 text-blue-400'
                        }`}>
                          {movie.isSeries ? 'Phim bộ' : 'Phim lẻ'}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          ⭐ {movie.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 border border-gray-600 text-gray-400 hover:bg-gray-600 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-gray-600 text-gray-400 hover:bg-gray-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="p-2 border border-red-600/50 text-red-400 hover:bg-red-600/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}