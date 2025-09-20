import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfiles, deleteProfile } from "@/apis/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types/auth";
import { 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  UserCheck,
  Image
} from "lucide-react";

export default function ProfileManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    profile: Profile | null;
  }>({ isOpen: false, profile: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchQuery]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải danh sách hồ sơ");
      // Mock data nếu API thất bại
      setProfiles([
        { id: "1", accountId: "1", name: "Admin User", avatarUrl: "" },
        { id: "2", accountId: "2", name: "John Doe", avatarUrl: "https://example.com/avatar1.jpg" },
        { id: "3", accountId: "3", name: "Jane Smith", avatarUrl: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = profiles;

    if (searchQuery) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.accountId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  };

  const handleDeleteProfile = async () => {
    if (!deleteConfirm.profile) return;

    try {
      setDeleting(true);
      await deleteProfile(deleteConfirm.profile.id);
      setProfiles(profiles.filter(profile => profile.id !== deleteConfirm.profile!.id));
      setDeleteConfirm({ isOpen: false, profile: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi xóa hồ sơ");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách hồ sơ..." />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Quản lý hồ sơ</h1>
          <p className="text-gray-400">
            Quản lý tất cả hồ sơ người dùng ({filteredProfiles.length} hồ sơ)
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-600/20 border border-red-600/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, ID hồ sơ hoặc ID tài khoản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>
          <Button variant="outline" className="border-neutral-800 text-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = profile.name.charAt(0).toUpperCase();
                        parent.className += " flex items-center justify-center";
                      }
                    }}
                  />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">{profile.name}</h3>
              <p className="text-sm text-gray-400">ID: {profile.id}</p>
              <p className="text-sm text-gray-400">Account: {profile.accountId}</p>
            </div>

            {/* Avatar Status */}
            <div className="flex justify-center mb-4">
              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                profile.avatarUrl 
                  ? "bg-green-600/20 text-green-400"
                  : "bg-gray-600/20 text-gray-400"
              }`}>
                <Image className="h-3 w-3 mr-1" />
                {profile.avatarUrl ? "Có avatar" : "Không có avatar"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link to={`/admin/profiles/${profile.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm({ isOpen: true, profile })}
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Không tìm thấy hồ sơ nào</p>
          <p className="text-gray-500 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, profile: null })}
        onConfirm={handleDeleteProfile}
        title="Xóa hồ sơ"
        message={`Bạn có chắc chắn muốn xóa hồ sơ "${deleteConfirm.profile?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa hồ sơ"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}