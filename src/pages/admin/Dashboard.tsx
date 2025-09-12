import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getAccounts, getProfiles } from "@/services/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Users, UserCheck, Film, TrendingUp, Eye, Plus } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalProfiles: 0,
    totalMovies: 6, // Mock data
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [accounts, profiles] = await Promise.all([
          getAccounts().catch(() => []),
          getProfiles().catch(() => [])
        ]);

        setStats({
          totalAccounts: accounts.length,
          totalProfiles: profiles.length,
          totalMovies: 6, // Mock data
          activeUsers: accounts.filter(acc => acc.role === "USER").length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Đang tải dashboard..." />;
  }

  const statCards = [
    {
      title: "Tổng tài khoản",
      value: stats.totalAccounts,
      icon: Users,
      color: "bg-blue-600",
      href: "/admin/accounts"
    },
    {
      title: "Tổng hồ sơ",
      value: stats.totalProfiles,
      icon: UserCheck,
      color: "bg-green-600",
      href: "/admin/profiles"
    },
    {
      title: "Tổng phim",
      value: stats.totalMovies,
      icon: Film,
      color: "bg-purple-600",
      href: "/admin/movies"
    },
    {
      title: "Người dùng hoạt động",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "bg-orange-600",
      href: "/admin/accounts"
    },
  ];

  const quickActions = [
    {
      title: "Tạo tài khoản mới",
      description: "Thêm tài khoản người dùng hoặc admin",
      icon: Plus,
      href: "/admin/accounts/create",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Xem tất cả tài khoản",
      description: "Quản lý và chỉnh sửa tài khoản",
      icon: Eye,
      href: "/admin/accounts",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Quản lý hồ sơ",
      description: "Xem và chỉnh sửa hồ sơ người dùng",
      icon: UserCheck,
      href: "/admin/profiles",
      color: "bg-purple-600 hover:bg-purple-700"
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Chào mừng, {user?.profile.name}!
        </h1>
        <p className="text-gray-400">
          Tổng quan hệ thống quản lý Netflix
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-600/20 border border-red-600/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.href}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
              >
                <div className="flex items-start">
                  <div className={`${action.color} p-3 rounded-lg transition-colors`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-gray-100">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Hoạt động gần đây</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-white text-sm">Tài khoản mới được tạo</p>
                <p className="text-gray-400 text-xs">2 phút trước</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-white text-sm">Hồ sơ được cập nhật</p>
                <p className="text-gray-400 text-xs">15 phút trước</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Film className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-white text-sm">Phim mới được thêm</p>
                <p className="text-gray-400 text-xs">1 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}