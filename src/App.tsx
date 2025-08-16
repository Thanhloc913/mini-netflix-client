import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/public/Home";
import MainLayout from "@/layout/MainLayout";
import Movie from "@/pages/public/Movie";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/movies" element={<MainLayout><Movie /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
