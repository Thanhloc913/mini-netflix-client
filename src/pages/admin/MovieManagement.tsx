import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMovies } from "@/hooks/queries/useMovieQueries";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { moviesApi } from "@/apis/movies";
import { Plus, Film, Eye, Edit, Trash2, Upload, Play, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function MovieManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;
  const queryClient = useQueryClient();

  // Use React Query with caching
  const { 
    data: moviesResponse, 
    isLoading: loading, 
    error,
    refetch
  } = useMovies(currentPage, moviesPerPage);

  const movies = moviesResponse?.movies || [];
  const totalMovies = moviesResponse?.total || 0;
  const totalPages = Math.ceil(totalMovies / moviesPerPage);

  // Prefetch next page for better UX
  useEffect(() => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.movies.list(currentPage + 1, moviesPerPage),
        queryFn: () => moviesApi.getAllMovies(currentPage + 1, moviesPerPage),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [currentPage, totalPages, queryClient, moviesPerPage]);

  const handleDeleteMovie = async (_movieId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phim này?")) return;
    
    try {
      // TODO: Implement delete API
      alert("Chức năng xóa phim đang phát triển");
    } catch (err) {
      alert("Lỗi xóa phim");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    refetch();
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
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-6">
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
            <p className="text-sm mt-1">{error instanceof Error ? error.message : "Có lỗi xảy ra"}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 px-3 py-1 text-sm border border-red-600/50 text-red-400 hover:bg-red-600/10 rounded"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Fixed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tổng phim</p>
                <p className="text-2xl font-bold text-white">{totalMovies}</p>
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
                <p className="text-gray-400 text-sm">Trang hiện tại</p>
                <p className="text-2xl font-bold text-white">{currentPage}/{totalPages}</p>
              </div>
              <Upload className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Movies List */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="bg-gray-800 border border-gray-700 rounded-lg h-full flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Film className="w-5 h-5" />
                Danh sách phim (Trang {currentPage}/{totalPages} - {totalMovies} phim)
              </h2>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-400 px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
                <p className="text-gray-400">Đang tải phim trang {currentPage}...</p>
              </div>
            ) : movies.length === 0 ? (
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
          
          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 p-4 border-t border-gray-700 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Đầu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={currentPage === pageNum 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cuối
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}