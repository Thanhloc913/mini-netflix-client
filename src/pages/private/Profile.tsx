import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema, ChangePasswordSchema, type UpdateProfileRequest, type ChangePasswordRequest } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile, changePassword, deleteAccount } from "@/services/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { User, Camera, Lock, Trash2, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<UpdateProfileRequest>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.profile.name || "",
    },
  });

  const passwordForm = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!user) {
    return <LoadingSpinner message="Đang tải thông tin..." />;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Chỉ chấp nhận file hình ảnh");
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Update profile với avatar (nếu có)
      if (avatar || data.name !== user.profile.name) {
        await updateProfile(user.profile.id, data.name, avatar || undefined);
      }

      await refreshUserData();
      setSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setAvatar(null);
      setAvatarPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await changePassword(data.currentPassword, data.newPassword);
      setSuccess("Đổi mật khẩu thành công!");
      setShowChangePassword(false);
      passwordForm.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteAccount(user.account.id);
      logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa tài khoản thất bại");
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-400">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-600/20 border border-red-600/50 text-red-400 p-4 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearMessages} className="text-red-400 hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-600/20 border border-green-600/50 text-green-400 p-4 rounded-lg flex items-center justify-between">
            <span>{success}</span>
            <button onClick={clearMessages} className="text-green-400 hover:text-green-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Ảnh đại diện
              </h2>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden mx-auto mb-4 border-4 border-gray-600">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : user.profile.avatarUrl ? (
                      <img 
                        src={user.profile.avatarUrl} 
                        alt={user.profile.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback nếu avatar không load được
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = user.profile.name?.charAt(0).toUpperCase() || "U";
                            parent.className += " flex items-center justify-center";
                          }
                        }}
                      />
                    ) : (
                      user.profile.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-colors shadow-lg"
                      title="Thay đổi ảnh đại diện"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                
                <p className="text-gray-400 text-sm">
                  {isEditing ? (
                    <>
                      Nhấp vào biểu tượng camera để thay đổi
                      <br />
                      <span className="text-xs">Chấp nhận JPG, PNG. Tối đa 5MB</span>
                    </>
                  ) : (
                    "Ảnh đại diện"
                  )}
                </p>
                
                {avatar && (
                  <p className="text-orange-400 text-xs mt-2">
                    Ảnh mới: {avatar.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Thông tin cá nhân</h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setAvatar(null);
                        setAvatarPreview(null);
                        profileForm.reset();
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>

              <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Tên hiển thị</label>
                    <Input
                      {...profileForm.register("name")}
                      disabled={!isEditing}
                      className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-red-400 text-sm mt-1">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Vai trò</label>
                  <Input
                    value={user.account.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                    disabled
                    className="bg-gray-700 border-gray-600 text-white opacity-50"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-gray-800 rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Đổi mật khẩu
                </h2>
                {!showChangePassword && (
                  <Button
                    onClick={() => setShowChangePassword(true)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Đổi mật khẩu
                  </Button>
                )}
              </div>

              {showChangePassword && (
                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Mật khẩu hiện tại</label>
                    <Input
                      {...passwordForm.register("currentPassword")}
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Mật khẩu mới</label>
                    <Input
                      {...passwordForm.register("newPassword")}
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Xác nhận mật khẩu mới</label>
                    <Input
                      {...passwordForm.register("confirmPassword")}
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        passwordForm.reset();
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Đổi mật khẩu"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Delete Account */}
            <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-6 mt-6">
              <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                Xóa tài khoản
              </h2>
              <p className="text-gray-300 mb-4">
                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </p>
              
              {!showDeleteConfirm ? (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900/30"
                >
                  Xóa tài khoản
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-400 font-medium">
                    Bạn có chắc chắn muốn xóa tài khoản? Nhập "XÓA TÀI KHOẢN" để xác nhận:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="XÓA TÀI KHOẢN"
                      className="bg-gray-700 border-red-600 text-white"
                      onChange={(e) => {
                        const deleteBtn = e.target.nextElementSibling as HTMLButtonElement;
                        if (deleteBtn) {
                          deleteBtn.disabled = e.target.value !== "XÓA TÀI KHOẢN";
                        }
                      }}
                    />
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 whitespace-nowrap"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Xác nhận xóa"
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}