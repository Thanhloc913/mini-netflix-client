import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterRequest } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, error, isAuthenticating, isAuthenticated, clearError } = useAuth();
  const [success, setSuccess] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      role: "USER" as const,
    },
  });

  // Watch password to show strength indicator
  const password = watch("password");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Focus on email field when component mounts
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Chỉ chấp nhận file hình ảnh");
        return;
      }
      setAvatar(file);
    }
  };

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerUser(data, avatar || undefined);
      setSuccess(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      // Error is handled by useAuth hook
      console.error("Registration failed:", err);
    }
  };

  if (success) {
    return (
      <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl text-center max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-semibold mb-4">Đăng ký thành công!</h1>
          <p className="text-gray-300 mb-4">Chào mừng bạn đến với Netflix! Đang chuyển hướng...</p>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl max-w-md w-full">
      <h1 className="text-white text-3xl font-semibold mb-8">Đăng ký</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white transition-colors"
            disabled={isAuthenticating}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("name")}
            type="text"
            placeholder="Tên hiển thị"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white transition-colors"
            disabled={isAuthenticating}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("password")}
            type="password"
            placeholder="Mật khẩu"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white transition-colors"
            disabled={isAuthenticating}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
          {password && password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${password.length >= level * 2
                      ? password.length >= 8
                        ? "bg-green-500"
                        : password.length >= 6
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      : "bg-gray-600"
                      }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Độ mạnh mật khẩu: {password.length >= 8 ? "Mạnh" : password.length >= 6 ? "Trung bình" : "Yếu"}
              </p>
            </div>
          )}
        </div>

        <div>
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white transition-colors"
            disabled={isAuthenticating}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block text-white text-sm mb-2">Ảnh đại diện (tùy chọn)</label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAuthenticating}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Chọn ảnh
            </Button>
            {avatar && (
              <span className="text-gray-300 text-sm truncate flex-1">{avatar.name}</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-1">Chấp nhận JPG, PNG. Tối đa 5MB.</p>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600/50 text-red-400 text-sm p-3 rounded-md">
            {error.includes("exist") ? "Email đã tồn tại trên hệ thống" : error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isAuthenticating}
          className="w-full h-12 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold rounded-md transition-colors"
        >
          {isAuthenticating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang đăng ký...
            </div>
          ) : (
            "Đăng ký"
          )}
        </Button>

        <div className="text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-white hover:underline">
            Đăng nhập ngay
          </Link>
          .
        </div>

        <div className="text-gray-400 text-xs leading-relaxed">
          Việc đăng ký này cho biết bạn đồng ý với{" "}
          <Link to="#" className="text-blue-500 hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link to="#" className="text-blue-500 hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi.
        </div>

        <div className="text-gray-400 text-xs leading-relaxed">
          Trang này được Google reCAPTCHA bảo vệ để đảm bảo bạn không phải là robot.{" "}
          <Link to="#" className="text-blue-500 hover:underline">
            Tìm hiểu thêm.
          </Link>
        </div>
      </form>
    </div>
  );
}


