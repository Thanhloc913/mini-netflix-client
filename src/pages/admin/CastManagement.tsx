import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCasts } from "@/hooks/queries/useCastQueries";
import { useCreateCast, useUpdateCast, useDeleteCast } from "@/hooks/mutations/useCastMutations";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Có lỗi xảy ra khi tải danh sách diễn viên</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý diễn viên</h1>
          <p className="text-neutral-400 mt-1">Quản lý diễn viên và đạo diễn trong hệ thống</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm diễn viên
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Tìm kiếm diễn viên..."
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
              <p className="text-sm text-neutral-400">Tổng diễn viên</p>
              <p className="text-2xl font-bold text-white">{casts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Diễn viên</p>
              <p className="text-2xl font-bold text-white">
                {casts.filter(cast => cast.role.toLowerCase().includes('actor')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Đạo diễn</p>
              <p className="text-2xl font-bold text-white">
                {casts.filter(cast => cast.role.toLowerCase().includes('director')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Casts Table */}
      <div className="bg-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Vai trò
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
              {filteredCasts.map((cast) => (
                <tr key={cast.id} className="hover:bg-neutral-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{cast.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cast.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-400">
                      {new Date(cast.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(cast)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingCast(cast)}
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

          {filteredCasts.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              {searchTerm ? `Không tìm thấy diễn viên nào với từ khóa "${searchTerm}"` : "Chưa có diễn viên nào"}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingCast) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCast ? "Chỉnh sửa diễn viên" : "Thêm diễn viên mới"}
            </h2>
            
            <form onSubmit={editingCast ? handleUpdateCast : handleCreateCast}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tên *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên diễn viên..."
                    className="bg-neutral-700 border-neutral-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Vai trò *
                  </label>
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="VD: Actor, Director, Producer..."
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
                  disabled={createCastMutation.isPending || updateCastMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
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
        description={`Bạn có chắc chắn muốn xóa diễn viên "${deletingCast?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={deleteCastMutation.isPending}
      />
    </div>
  );
}