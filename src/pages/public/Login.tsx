import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type loginType } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { loginApi } from "@/apis/auth";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: loginType) => {
    setError(null);
    setLoading(true);
    try {
      const tokens = await loginApi(data);
      setTokens(tokens);
      window.location.href = "/";
    } catch (e) {
      const message = e instanceof Error ? e.message : "Đăng nhập thất bại";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
      <h1 className="text-white text-3xl font-semibold mb-8">Đăng nhập</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            {...register("username")}
            type="text"
            placeholder="Email hoặc số điện thoại"
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

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <div className="text-center">
          <span className="text-white text-sm">HOẶC</span>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Sử dụng mã đăng nhập
        </Button>

        <div className="text-center">
          <Link to="#" className="text-white hover:underline text-sm">
            Quên mật khẩu?
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
          />
          <label htmlFor="remember" className="text-white text-sm">
            Ghi nhớ tôi
          </label>
        </div>

        <div className="text-gray-400 text-sm">
          Bạn mới sử dụng Netflix?{" "}
          <Link to="/register" className="text-white hover:underline">
            Đăng ký ngay
          </Link>
          .
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


