import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAccounts, useProfiles } from "@/hooks/queries/useAuthQueries";
import { useMovies } from "@/hooks/queries/useMovieQueries";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import StatCard from "@/components/admin/StatCard";
import ActionCard from "@/components/admin/ActionCard";
import { Users, UserCheck, Film, TrendingUp, Eye, Plus, Upload } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();
  const { data: moviesData, isLoading: moviesLoading } = useMovies(1, 1);

  const stats = useMemo(() => ({
    totalAccounts: accounts.length,
    totalProfiles: profiles.length,
    totalMovies: moviesData?.total || 0,
    activeUsers: accounts.filter(acc => acc.role === "USER").length,
  }), [accounts.length, profiles.length, moviesData?.total]);

  const loading = accountsLoading || profilesLoading || moviesLoading;

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
    {
      title: "Upload phim mới",
      description: "Tải lên phim mới vào hệ thống",
      icon: Upload,
      href: "/admin/movies/upload",
      color: "bg-red-600 hover:bg-red-700"
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



      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            href={card.href}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <ActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
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