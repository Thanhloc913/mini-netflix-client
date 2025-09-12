import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccounts, deleteAccount } from "@/services/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Account } from "@/types/auth";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  MoreHorizontal,
  Shield,
  User
} from "lucide-react";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    account: Account | null;
  }>({ isOpen: false, account: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchQuery, roleFilter]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải danh sách tài khoản");
      // Mock data nếu API thất bại
      setAccounts([
        { id: "1", email: "admin@example.com", role: "ADMIN" },
        { id: "2", email: "user1@example.com", role: "USER" },
        { id: "3", email: "user2@example.com", role: "USER" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = accounts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(account => account.role === roleFilter);
    }

    setFilteredAccounts(filtered);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm.account) return;

    try {
      setDeleting(true);
      await deleteAccount(deleteConfirm.account.id);
      setAccounts(accounts.filter(acc => acc.id !== deleteConfirm.account!.id));
      setDeleteConfirm({ isOpen: false, account: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi xóa tài khoản");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách tài khoản..." />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Quản lý tài khoản</h1>
          <p className="text-gray-400">
            Quản lý tất cả tài khoản trong hệ thống ({filteredAccounts.length} tài khoản)
          </p>
        </div>
        <Link to="/admin/accounts/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo tài khoản
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-600/20 border border-red-600/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo email hoặc ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "ALL" | "USER" | "ADMIN")}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
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
                <tr key={account.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {account.role === "ADMIN" ? (
                          <Shield className="h-5 w-5 text-red-400" />
                        ) : (
                          <User className="h-5 w-5 text-blue-400" />
                        )}
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.role === "ADMIN"
                        ? "bg-red-600/20 text-red-400"
                        : "bg-blue-600/20 text-blue-400"
                    }`}>
                      {account.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {account.createdAt ? new Date(account.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/accounts/${account.id}`}>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm({ isOpen: true, account })}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
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
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Không tìm thấy tài khoản nào</p>
            <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc tạo tài khoản mới</p>
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
        confirmText="Xóa tài khoản"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}