import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/public/Home";
import MainLayout from "@/layout/MainLayout";
import Movie from "@/pages/public/Movie";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "./pages/public/Register";
import ProfilePage from "./pages/private/Profile";
import AuthLayout from "./layout/AuthLayout";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "./providers/AuthProvider";

export default function AppRouter() {
  return (
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

        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
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
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
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
  );
}
