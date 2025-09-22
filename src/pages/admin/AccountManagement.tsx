import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAccounts } from "@/hooks/queries/useAuthQueries";
import { useDeleteAccount } from "@/hooks/mutations/useAuthMutations";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatCard from "@/components/admin/StatCard";
import type { Account } from "@/types/auth";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Shield,
  User
} from "lucide-react";

export default function AccountManagement() {
  const { data: accounts = [], isLoading: loading, error } = useAccounts();
  const deleteAccountMutation = useDeleteAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    account: Account | null;
  }>({ isOpen: false, account: null });

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = account.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || account.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [accounts, searchQuery, roleFilter]);

  const statsData = useMemo(() => [
    {
      title: "Tổng tài khoản",
      value: accounts.length,
      icon: User,
      color: "bg-blue-600"
    },
    {
      title: "Người dùng",
      value: accounts.filter(acc => acc.role === 'USER').length,
      icon: User,
      color: "bg-green-600"
    },
    {
      title: "Quản trị viên",
      value: accounts.filter(acc => acc.role === 'ADMIN').length,
      icon: Shield,
      color: "bg-purple-600"
    },
    {
      title: "Kết quả tìm kiếm",
      value: filteredAccounts.length,
      icon: Search,
      color: "bg-orange-600"
    }
  ], [accounts, filteredAccounts.length]);

  const handleDeleteAccount = async () => {
    if (!deleteConfirm.account) return;

    try {
      await deleteAccountMutation.mutateAsync(deleteConfirm.account.id);
      setDeleteConfirm({ isOpen: false, account: null });
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách tài khoản..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 border border-neutral-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý tài khoản</h1>
          <p className="text-gray-400">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <Link to="/admin/accounts/create">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tạo tài khoản
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "ALL" | "USER" | "ADMIN")}
              className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-white"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-200">
            {error instanceof Error ? error.message : "Có lỗi xảy ra"}
          </p>
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900 border border-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tài khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {account.email}
                        </div>
                        <div className="text-sm text-gray-400">
                          ID: {account.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.role === "ADMIN"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                      }`}>
                      {account.role === "ADMIN" ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {account.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {account.createdAt ? new Date(account.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/accounts/${account.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => setDeleteConfirm({ isOpen: true, account })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">
              Không có tài khoản nào
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery || roleFilter !== "ALL"
                ? "Không tìm thấy tài khoản phù hợp với bộ lọc."
                : "Chưa có tài khoản nào trong hệ thống."
              }
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, account: null })}
        onConfirm={handleDeleteAccount}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteConfirm.account?.email}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteAccountMutation.isPending}
      />
    </div>
  );
}