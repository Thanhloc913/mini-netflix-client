import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { RegisterSchema } from "@/schemas/auth.schema";
import type { RegisterRequest } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useRegister } from "@/hooks/queries/useAuthQueries";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const registerMutation = useRegister();
  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch is available for form validation if needed
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate({ userData: data, avatar: avatar || undefined });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            My<span className="text-red-600">Netflix</span>
          </h1>
          <h2 className="text-2xl font-semibold text-white">Đăng ký tài khoản</h2>
          <p className="text-gray-400 mt-2">
            Tạo tài khoản để trải nghiệm dịch vụ streaming tốt nhất
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="w-full bg-gray-800 border-gray-700 text-white"
              placeholder="your@email.com"
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Tên hiển thị
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className="w-full bg-gray-800 border-gray-700 text-white"
              placeholder="Tên của bạn"
              disabled={registerMutation.isPending}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="w-full bg-gray-800 border-gray-700 text-white"
              placeholder="••••••••"
              disabled={registerMutation.isPending}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full bg-gray-800 border-gray-700 text-white"
              placeholder="••••••••"
              disabled={registerMutation.isPending}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ảnh đại diện (tùy chọn)
            </label>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={registerMutation.isPending}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Chọn ảnh
              </Button>
              {avatar && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{avatar.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    className="text-red-400 hover:text-red-300"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {registerMutation.error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
              <p className="text-red-200 text-sm">
                {registerMutation.error instanceof Error 
                  ? registerMutation.error.message 
                  : "Đăng ký thất bại"}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
          >
            {registerMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang đăng ký...
              </div>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}