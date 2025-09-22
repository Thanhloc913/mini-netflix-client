import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/public/Home";
import MainLayout from "@/layout/MainLayout";
import Movie from "@/pages/public/Movie";
import MovieDetail from "@/pages/public/MovieDetail";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "./pages/public/Register";
import ProfilePage from "./pages/private/Profile";
import AuthLayout from "./layout/AuthLayout";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AccountManagement from "./pages/admin/AccountManagement";
import ProfileManagement from "./pages/admin/ProfileManagement";
import CreateAccount from "./pages/admin/CreateAccount";
import MovieUpload from "./pages/admin/MovieUpload";
import MovieManagement from "./pages/admin/MovieManagement";
import GenreManagement from "./pages/admin/GenreManagement";
import CastManagement from "./pages/admin/CastManagement";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "./providers/AuthProvider";
import { QueryProvider } from "./providers/QueryProvider";

export default function AppRouter() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />

            {/* Public Home route - accessible without login */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Movie />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <MainLayout>
                  <MovieDetail />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accounts"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <AccountManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accounts/create"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <CreateAccount />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profiles"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <ProfileManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <MovieManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/movies/upload"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <MovieUpload />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/genres"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <GenreManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/casts"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout>
                    <CastManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-white text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-400 mb-6">Trang không tồn tại</p>
                    <a
                      href="/"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
                    >
                      Về trang chủ
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}
