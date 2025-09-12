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
      navigate("/login", { replace: true });
      return;
    }

    // Nếu đã load xong và không authenticated
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    
    // Nếu cần admin nhưng không phải admin
    if (!isLoading && requireAdmin && !isAdmin) {
      navigate("/", { replace: true });
      return;
    }
  }, [accessToken, isAuthenticated, isAdmin, isLoading, navigate, requireAdmin]);

  // Hiển thị loading nếu có token nhưng chưa có user data
  if (accessToken && (!user || isLoading)) {
    return <LoadingSpinner message="Đang tải thông tin người dùng..." />;
  }

  // Nếu không có token hoặc không authenticated
  if (!accessToken || !isAuthenticated) {
    return null;
  }

  // Nếu cần admin nhưng không phải admin
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
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