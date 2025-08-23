import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/public/Home";
import MainLayout from "@/layout/MainLayout";
import Movie from "@/pages/public/Movie";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "./pages/public/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/movies" element={<MainLayout><Movie /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
