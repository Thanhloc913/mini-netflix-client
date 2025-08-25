import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type registerRequest } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { registerApi } from "@/apis/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerRequest>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: registerRequest) => {
    setError(null);
    setLoading(true);
    try {
      await registerApi(data);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Đăng ký thất bại";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl text-center">
        <h1 className="text-white text-3xl font-semibold mb-4">Đăng ký thành công!</h1>
        <p className="text-gray-300 mb-4">Đang chuyển hướng đến trang đăng nhập...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
      <h1 className="text-white text-3xl font-semibold mb-8">Đăng ký</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("username")}
            type="text"
            placeholder="Tên đăng nhập"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("password")}
            type="password"
            placeholder="Mật khẩu"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("avatarURL")}
            type="url"
            placeholder="URL Avatar (tùy chọn)"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white"
          />
          {errors.avatarURL && (
            <p className="text-red-500 text-sm mt-1">{errors.avatarURL.message}</p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error.includes("exist") ? "Tên đăng nhập hoặc email đã tồn tại trên hệ thống" : error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
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


