import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

const CreateAccountSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.enum(["USER", "ADMIN"]),
});

type CreateAccountRequest = z.infer<typeof CreateAccountSchema>;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAccountRequest>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "USER",
    },
  });

  const onSubmit = async (data: CreateAccountRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // TODO: Implement actual API call
      console.log("Creating account:", data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Tài khoản đã được tạo thành công!");
      reset();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/accounts");
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/admin/accounts">
          <Button variant="outline" size="sm" className="mr-4 border-gray-600 text-gray-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Tạo tài khoản mới</h1>
          <p className="text-gray-400">Thêm tài khoản người dùng hoặc quản trị viên</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-600/20 border border-red-600/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-600/20 border border-green-600/50 text-green-400 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-gray-800 rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="user@example.com"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mật khẩu <span className="text-red-400">*</span>
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Nhập mật khẩu"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Vai trò <span className="text-red-400">*</span>
              </label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                disabled={loading}
              >
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
              {errors.role && (
                <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Tạo tài khoản
              </Button>
              
              <Link to="/admin/accounts">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={loading}
                >
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}