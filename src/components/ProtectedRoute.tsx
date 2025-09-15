import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading, accessToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu không có token, redirect ngay
    if (!accessToken) {
      console.log("🚫 No access token, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }

    // Nếu đã load xong và không authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("🚫 Not authenticated after loading, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }
    
    // Nếu có user data và cần admin nhưng không phải admin
    if (user && !isLoading && requireAdmin && !isAdmin) {
      console.log("🚫 Not admin, redirecting to home");
      navigate("/", { replace: true });
      return;
    }
  }, [accessToken, isAuthenticated, isAdmin, isLoading, navigate, requireAdmin, user]);

  // Hiển thị loading nếu có token nhưng chưa có user data
  if (accessToken && !user && isLoading) {
    return <LoadingSpinner message="Đang tải thông tin người dùng..." />;
  }

  // Nếu không có token
  if (!accessToken) {
    return null;
  }

  // Nếu có token nhưng không có user data và không đang loading (có thể token hết hạn)
  if (accessToken && !user && !isLoading) {
    console.log("⚠️ Have token but no user data and not loading - token might be expired");
    return <LoadingSpinner message="Đang xác thực..." />;
  }

  // Nếu cần admin nhưng không phải admin (chỉ check khi có user data)
  if (user && requireAdmin && !isAdmin) {
    return null;
  }

  // Nếu có user data hoặc đang loading
  if (user || isLoading) {
    return <>{children}</>;
  }

  return null;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading, accessToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu có token và user data, redirect về home
    if (accessToken && user && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [accessToken, user, isLoading, navigate]);

  // Nếu có token nhưng đang load user data
  if (accessToken && !user && isLoading) {
    return <LoadingSpinner message="Đang kiểm tra đăng nhập..." />;
  }

  return <>{children}</>;
}