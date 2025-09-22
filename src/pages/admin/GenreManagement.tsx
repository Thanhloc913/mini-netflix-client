import { useState } from "react";
import { Plus, Edit, Trash2, Search, Tags, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenres } from "@/hooks/queries/useGenreQueries";
import { useCreateGenre, useUpdateGenre, useDeleteGenre } from "@/hooks/mutations/useGenreMutations";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import StatCard from "@/components/admin/StatCard";
import type { Genre, CreateGenreRequest, UpdateGenreRequest } from "@/types/genre";

interface GenreFormData {
  name: string;
}

export default function GenreManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState<GenreFormData>({ name: "" });

  const { data: genres = [], isLoading, error } = useGenres();
  const createGenreMutation = useCreateGenre();
  const updateGenreMutation = useUpdateGenre();
  const deleteGenreMutation = useDeleteGenre();

  // Filter genres based on search term
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const genreData: CreateGenreRequest = {
        name: formData.name.trim()
      };
      
      await createGenreMutation.mutateAsync(genreData);
      setIsCreateModalOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Failed to create genre:", error);
    }
  };

  const handleUpdateGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenre || !formData.name.trim()) return;

    try {
      const updateData: UpdateGenreRequest = {
        name: formData.name.trim()
      };
      
      await updateGenreMutation.mutateAsync({
        id: editingGenre.id,
        data: updateData
      });
      setEditingGenre(null);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Failed to update genre:", error);
    }
  };

  const handleDeleteGenre = async () => {
    if (!deletingGenre) return;

    try {
      await deleteGenreMutation.mutateAsync(deletingGenre.id);
      setDeletingGenre(null);
    } catch (error) {
      console.error("Failed to delete genre:", error);
    }
  };

  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({ name: genre.name });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingGenre(null);
    setFormData({ name: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải danh sách thể loại...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý thể loại</h1>
          <p className="text-gray-400">Quản lý các thể loại phim trong hệ thống</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm thể loại
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600/30 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="text-sm mt-1">Có lỗi xảy ra khi tải danh sách thể loại</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-900 border border-neutral-800 text-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Tổng thể loại"
          value={genres.length}
          icon={Tags}
          color="bg-blue-600"
        />
        <StatCard
          title="Kết quả tìm kiếm"
          value={filteredGenres.length}
          icon={Search}
          color="bg-green-600"
        />
        <StatCard
          title="Thể loại phổ biến"
          value={Math.min(genres.length, 10)}
          icon={Hash}
          color="bg-purple-600"
        />
      </div>

      {/* Genres List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Tags className="w-5 h-5" />
            Danh sách thể loại ({filteredGenres.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredGenres.length === 0 ? (
            <div className="text-center py-12">
              <Tags className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                {searchTerm ? `Không tìm thấy thể loại "${searchTerm}"` : "Chưa có thể loại nào"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Hãy thêm thể loại đầu tiên"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm thể loại ngay
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGenres.map((genre) => (
                <div
                  key={genre.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Tags className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {genre.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(genre.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400">
                          Thể loại
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(genre)}
                      className="p-2 border border-gray-600 text-gray-400 hover:bg-gray-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeletingGenre(genre)}
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

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingGenre) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingGenre ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
            </h2>
            
            <form onSubmit={editingGenre ? handleUpdateGenre : handleCreateGenre}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên thể loại *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên thể loại..."
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModals}
                  className="text-gray-400 hover:text-white border border-gray-600"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={createGenreMutation.isPending || updateGenreMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {createGenreMutation.isPending || updateGenreMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : null}
                  {editingGenre ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingGenre}
        onClose={() => setDeletingGenre(null)}
        onConfirm={handleDeleteGenre}
        title="Xóa thể loại"
        message={`Bạn có chắc chắn muốn xóa thể loại "${deletingGenre?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteGenreMutation.isPending}
      />
    </div>
  );
}