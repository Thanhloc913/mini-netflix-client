import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Film,
  Tags,
  UserCircle
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close sidebar when route changes on mobile
  const closeSidebar = () => setSidebarOpen(false);

  const navigation = [
    { name: "Tổng quan", href: "/admin", icon: Home },
    { name: "Quản lý tài khoản", href: "/admin/accounts", icon: Users },
    { name: "Quản lý hồ sơ", href: "/admin/profiles", icon: UserCheck },
    { name: "Quản lý phim", href: "/admin/movies", icon: Film },
    { name: "Quản lý thể loại", href: "/admin/genres", icon: Tags },
    { name: "Quản lý diễn viên", href: "/admin/casts", icon: UserCircle },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-neutral-950">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-neutral-100 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col h-full lg:w-64 md:w-56 sm:w-48 shadow-xl lg:shadow-none`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">
            Admin <span className="text-red-600">Panel</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation - scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 sidebar-scroll">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-red-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info - fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.profile.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.profile.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/profile" className="flex-1">
              <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Cài đặt
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 px-2"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar - Always visible on mobile */}
        <header className="bg-neutral-900 border-b border-neutral-800 lg:hidden flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white p-2 -ml-2"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold text-white truncate">Admin Panel</h1>
            <div className="w-9"></div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-neutral-950 text-neutral-100 min-h-0">
          {children}
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}