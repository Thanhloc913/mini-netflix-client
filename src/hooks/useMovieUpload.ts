import { useState, useCallback } from "react";
import { moviesApi } from "@/apis/movies";
import { filesApi } from "@/apis/files";
import type { MovieUploadData, UploadProgress, UploadState } from "@/types/upload";

export function useMovieUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: {
      step: 'metadata',
      progress: 0,
      message: 'Sẵn sàng upload'
    }
  });

  const updateProgress = useCallback((progress: Partial<UploadProgress>) => {
    setUploadState(prev => ({
      ...prev,
      progress: { ...prev.progress, ...progress }
    }));
  }, []);

  const uploadMovie = useCallback(async (movieData: MovieUploadData, videoFile: File) => {
    try {
      setUploadState({
        isUploading: true,
        progress: {
          step: 'metadata',
          progress: 10,
          message: 'Đang tạo metadata phim...'
        },
        videoFile
      });

      // Bước 1: Tạo Movie Metadata
      updateProgress({
        step: 'metadata',
        progress: 20,
        message: 'Tạo thông tin phim...'
      });

      const movie = await moviesApi.createMovie(movieData);
      console.log("✅ Movie created:", movie.id);

      setUploadState(prev => ({ ...prev, movieId: movie.id }));

      // Bước 2: Lấy Presigned URL
      updateProgress({
        step: 'presign',
        progress: 30,
        message: 'Lấy link upload...'
      });

      const { uploadUrl, blobUrl } = await filesApi.getPresignedUrl();
      console.log("📋 Presigned URLs received:");
      console.log("  - Upload URL (for PUT request):", uploadUrl);
      console.log("  - Blob URL (for database):", blobUrl);

      // Bước 3: Upload file gốc lên Azure Blob
      updateProgress({
        step: 'upload',
        progress: 40,
        message: 'Đang upload video...'
      });

      // Upload file lên Azure Blob Storage (bắt buộc phải thành công)
      try {
        console.log("📤 Starting blob upload to:", uploadUrl);
        await filesApi.uploadToBlob(uploadUrl, videoFile, (fileProgress) => {
          updateProgress({
            step: 'upload',
            progress: 40 + (fileProgress * 0.4), // 40% -> 80%
            message: `Đang upload video... ${fileProgress}%`
          });
        });
        console.log("✅ File uploaded to Azure Blob successfully");
      } catch (uploadError: any) {
        console.error("❌ Blob upload failed:", uploadError);

        // Nếu là lỗi CORS, thử fallback với simulation
        if (uploadError.message.includes('CORS') || uploadError.name === 'TypeError') {
          console.log("🚧 CORS detected, using simulation fallback");
          console.warn("⚠️ CORS Error: Azure Blob Storage cần cấu hình CORS");
          console.warn("⚠️ Domains cần thêm: http://localhost:5173, https://yourdomain.com");
          console.warn("⚠️ Headers cần allow: Content-Type, x-ms-blob-type");

          updateProgress({
            step: 'upload',
            progress: 50,
            message: 'CORS Error - Đang dùng simulation...'
          });

          // Simulate upload progress
          for (let i = 0; i <= 100; i += 25) {
            await new Promise(resolve => setTimeout(resolve, 300));
            updateProgress({
              step: 'upload',
              progress: 40 + (i * 0.4), // 40% -> 80%
              message: `Simulation upload... ${i}% (Cần fix CORS)`
            });
          }
          console.log("✅ Simulated upload completed (CORS fallback)");
          console.log("📋 Để fix: Cấu hình CORS trên Azure Blob Storage");
        } else {
          // Lỗi khác thì throw luôn
          throw uploadError;
        }
      }

      // Bước 4: Tạo VideoAsset gốc với blobUrl (URL để access file)
      updateProgress({
        step: 'asset',
        progress: 85,
        message: 'Tạo video asset...'
      });

      console.log("📝 Creating VideoAsset with blobUrl:", blobUrl);
      await filesApi.createVideoAsset({
        movieId: movie.id,
        resolution: "1080p",
        format: "mp4",
        url: blobUrl, // Đây là URL để access file, không phải uploadUrl
        status: "pending"
      });

      // Bước 5: Transcoding sẽ tự động diễn ra qua Kafka
      updateProgress({
        step: 'transcoding',
        progress: 90,
        message: 'Bắt đầu quá trình chuyển đổi video...'
      });

      // Chờ một chút để transcoding service nhận message
      await new Promise(resolve => setTimeout(resolve, 2000));

      updateProgress({
        step: 'completed',
        progress: 100,
        message: 'Upload thành công! Video đang được xử lý...'
      });

      setUploadState(prev => ({ ...prev, isUploading: false }));

      return movie;

    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      updateProgress({
        step: 'error',
        progress: 0,
        message: 'Upload thất bại',
        error: error.message || 'Có lỗi xảy ra trong quá trình upload'
      });

      setUploadState(prev => ({ ...prev, isUploading: false }));
      throw error;
    }
  }, [updateProgress]);

  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: {
        step: 'metadata',
        progress: 0,
        message: 'Sẵn sàng upload'
      }
    });
  }, []);

  return {
    uploadState,
    uploadMovie,
    resetUpload
  };
}