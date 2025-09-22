import { useState } from "react";
import { Plus, Edit, Trash2, Search, UserCircle, Calendar, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCasts } from "@/hooks/queries/useCastQueries";
import { useCreateCast, useUpdateCast, useDeleteCast } from "@/hooks/mutations/useCastMutations";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import StatCard from "@/components/admin/StatCard";
import type { Cast, CreateCastRequest, UpdateCastRequest } from "@/types/cast";

interface CastFormData {
  name: string;
  role: string;
}

export default function CastManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCast, setEditingCast] = useState<Cast | null>(null);
  const [deletingCast, setDeletingCast] = useState<Cast | null>(null);
  const [formData, setFormData] = useState<CastFormData>({ name: "", role: "" });

  const { data: casts = [], isLoading, error } = useCasts();
  const createCastMutation = useCreateCast();
  const updateCastMutation = useUpdateCast();
  const deleteCastMutation = useDeleteCast();

  // Filter casts based on search term
  const filteredCasts = casts.filter(cast =>
    cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cast.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) return;

    try {
      const castData: CreateCastRequest = {
        name: formData.name.trim(),
        role: formData.role.trim()
      };

      await createCastMutation.mutateAsync(castData);
      setIsCreateModalOpen(false);
      setFormData({ name: "", role: "" });
    } catch (error) {
      console.error("Failed to create cast:", error);
    }
  };

  const handleUpdateCast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCast || !formData.name.trim() || !formData.role.trim()) return;

    try {
      const updateData: UpdateCastRequest = {
        name: formData.name.trim(),
        role: formData.role.trim()
      };

      await updateCastMutation.mutateAsync({
        id: editingCast.id,
        data: updateData
      });
      setEditingCast(null);
      setFormData({ name: "", role: "" });
    } catch (error) {
      console.error("Failed to update cast:", error);
    }
  };

  const handleDeleteCast = async () => {
    if (!deletingCast) return;

    try {
      await deleteCastMutation.mutateAsync(deletingCast.id);
      setDeletingCast(null);
    } catch (error) {
      console.error("Failed to delete cast:", error);
    }
  };

  const openEditModal = (cast: Cast) => {
    setEditingCast(cast);
    setFormData({ name: cast.name, role: cast.role });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingCast(null);
    setFormData({ name: "", role: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải danh sách diễn viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý diễn viên</h1>
          <p className="text-gray-400">Quản lý diễn viên và đạo diễn trong hệ thống</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm diễn viên
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600/30 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="text-sm mt-1">Có lỗi xảy ra khi tải danh sách diễn viên</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm diễn viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-900 border border-neutral-800 text-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng diễn viên"
          value={casts.length}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Diễn viên"
          value={casts.filter(cast => cast.role.toLowerCase().includes('actor')).length}
          icon={UserCircle}
          color="bg-green-600"
        />
        <StatCard
          title="Đạo diễn"
          value={casts.filter(cast => cast.role.toLowerCase().includes('director')).length}
          icon={Star}
          color="bg-purple-600"
        />
        <StatCard
          title="Kết quả tìm kiếm"
          value={filteredCasts.length}
          icon={Search}
          color="bg-orange-600"
        />
      </div>

      {/* Casts List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Danh sách diễn viên ({filteredCasts.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredCasts.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                {searchTerm ? `Không tìm thấy diễn viên "${searchTerm}"` : "Chưa có diễn viên nào"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Hãy thêm diễn viên đầu tiên"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm diễn viên ngay
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCasts.map((cast) => (
                <div
                  key={cast.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {cast.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(cast.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cast.role.toLowerCase().includes('director')
                          ? 'bg-purple-600/20 text-purple-400'
                          : cast.role.toLowerCase().includes('actor')
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-blue-600/20 text-blue-400'
                          }`}>
                          {cast.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(cast)}
                      className="p-2 border border-gray-600 text-gray-400 hover:bg-gray-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCast(cast)}
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
      {(isCreateModalOpen || editingCast) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCast ? "Chỉnh sửa diễn viên" : "Thêm diễn viên mới"}
            </h2>

            <form onSubmit={editingCast ? handleUpdateCast : handleCreateCast}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên diễn viên..."
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vai trò *
                  </label>
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="VD: Actor, Director, Producer..."
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
                  disabled={createCastMutation.isPending || updateCastMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {createCastMutation.isPending || updateCastMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : null}
                  {editingCast ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCast}
        onClose={() => setDeletingCast(null)}
        onConfirm={handleDeleteCast}
        title="Xóa diễn viên"
        message={`Bạn có chắc chắn muốn xóa diễn viên "${deletingCast?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteCastMutation.isPending}
      />
    </div>
  );
}