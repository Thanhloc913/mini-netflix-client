import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginRequest } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, isAuthenticating, isAuthenticated, clearError } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate("/", { replace: true });
    } catch (err) {
      // Error is handled by useAuth hook
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
      <h1 className="text-white text-3xl font-semibold mb-8">Đăng nhập</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email hoặc số điện thoại"
            className="w-full h-14 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:bg-gray-600 focus:border-white transition-colors"
            disabled={isAuthenticating}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600/50 text-red-400 text-sm p-3 rounded-md">
            {error}
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
              Đang đăng nhập...
            </div>
          ) : (
            "Đăng nhập"
          )}
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


