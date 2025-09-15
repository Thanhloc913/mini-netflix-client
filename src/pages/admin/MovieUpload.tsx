import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMovieUpload } from "@/hooks/useMovieUpload";
import type { MovieUploadData } from "@/types/upload";
import { Upload, Film, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function MovieUpload() {
  const navigate = useNavigate();
  const { uploadState, uploadMovie, resetUpload } = useMovieUpload();
  
  const [formData, setFormData] = useState<MovieUploadData>({
    title: "",
    description: "",
    releaseDate: "",
    duration: 0,
    isSeries: false,
    posterUrl: "",
    trailerUrl: "",
    genreIds: [],
    castIds: []
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof MovieUploadData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      alert("Vui lòng chọn file video");
      return;
    }

    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên phim");
      return;
    }

    try {
      await uploadMovie(formData, videoFile);
      // Upload thành công, có thể redirect hoặc reset form
      setTimeout(() => {
        navigate("/admin/movies");
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const getStepIcon = (step: string) => {
    if (uploadState.progress.step === step) {
      if (step === 'error') return <AlertCircle className="w-5 h-5 text-red-500" />;
      if (step === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Phim Mới</h1>
        <p className="text-gray-400">Tải lên phim mới vào hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Upload */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Film className="w-5 h-5" />
              Thông Tin Phim
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tên phim *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nhập tên phim"
                  disabled={uploadState.isUploading}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Mô tả nội dung phim"
                  rows={4}
                  disabled={uploadState.isUploading}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ngày phát hành
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                    disabled={uploadState.isUploading}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
                    placeholder="120"
                    disabled={uploadState.isUploading}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poster URL
                </label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => handleInputChange("posterUrl", e.target.value)}
                  placeholder="https://example.com/poster.jpg"
                  disabled={uploadState.isUploading}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  File Video *
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploadState.isUploading}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 disabled:opacity-50"
                />
                {videoFile && (
                  <p className="text-sm text-gray-400 mt-1">
                    Đã chọn: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSeries"
                  checked={formData.isSeries}
                  onChange={(e) => handleInputChange("isSeries", e.target.checked)}
                  disabled={uploadState.isUploading}
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                />
                <label htmlFor="isSeries" className="text-sm font-medium text-gray-300">
                  Đây là phim bộ
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploadState.isUploading || !videoFile || !formData.title.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {uploadState.isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang upload...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Phim
                    </>
                  )}
                </button>

                {uploadState.progress.step === 'completed' && (
                  <button
                    type="button"
                    onClick={resetUpload}
                    className="px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Upload phim khác
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Tiến Trình Upload</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{uploadState.progress.message}</span>
                  <span>{uploadState.progress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      uploadState.progress.step === 'error' 
                        ? 'bg-red-500' 
                        : uploadState.progress.step === 'completed'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${uploadState.progress.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {getStepIcon('metadata')}
                  <span className="text-sm">Tạo thông tin phim</span>
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon('presign')}
                  <span className="text-sm">Lấy link upload</span>
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon('upload')}
                  <span className="text-sm">Upload video gốc</span>
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon('asset')}
                  <span className="text-sm">Tạo video asset</span>
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon('transcoding')}
                  <span className="text-sm">Chuyển đổi video (720p, 480p)</span>
                </div>
              </div>

              {uploadState.progress.error && (
                <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Lỗi upload</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">{uploadState.progress.error}</p>
                  {uploadState.progress.error.includes('CORS') && (
                    <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
                      <p className="text-yellow-300 text-sm">
                        <strong>Giải pháp:</strong> Server cần cấu hình CORS headers cho Azure Blob Storage:
                      </p>
                      <ul className="text-yellow-300 text-xs mt-1 ml-4 list-disc">
                        <li>Thêm domain frontend vào CORS allowed origins</li>
                        <li>Allow methods: PUT, POST, GET</li>
                        <li>Allow headers: Content-Type, x-ms-blob-type</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {uploadState.progress.step === 'completed' && (
                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Upload thành công!</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">
                    Video đang được xử lý. Quá trình chuyển đổi có thể mất vài phút.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}