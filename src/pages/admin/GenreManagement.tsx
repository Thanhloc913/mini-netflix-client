import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenres } from "@/hooks/queries/useGenreQueries";
import { useCreateGenre, useUpdateGenre, useDeleteGenre } from "@/hooks/mutations/useGenreMutations";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Có lỗi xảy ra khi tải danh sách thể loại</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý thể loại</h1>
          <p className="text-neutral-400 mt-1">Quản lý các thể loại phim trong hệ thống</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm thể loại
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Tìm kiếm thể loại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-neutral-800 border-neutral-700 text-white"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Tổng thể loại</p>
              <p className="text-2xl font-bold text-white">{genres.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Genres Table */}
      <div className="bg-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Tên thể loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {filteredGenres.map((genre) => (
                <tr key={genre.id} className="hover:bg-neutral-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{genre.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-400">
                      {new Date(genre.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(genre)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingGenre(genre)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGenres.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              {searchTerm ? `Không tìm thấy thể loại nào với từ khóa "${searchTerm}"` : "Chưa có thể loại nào"}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingGenre) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingGenre ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
            </h2>
            
            <form onSubmit={editingGenre ? handleUpdateGenre : handleCreateGenre}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tên thể loại *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên thể loại..."
                    className="bg-neutral-700 border-neutral-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModals}
                  className="text-neutral-400 hover:text-white"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={createGenreMutation.isPending || updateGenreMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
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
        description={`Bạn có chắc chắn muốn xóa thể loại "${deletingGenre?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={deleteGenreMutation.isPending}
      />
    </div>
  );
}