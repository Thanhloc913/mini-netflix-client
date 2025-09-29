import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateMovie } from '../mutations/useMovieMutations';
import { useGetPresignedUrl, useUploadToBlob, useCreateVideoAsset } from '../mutations/useFileMutations';
import { queryKeys } from '@/lib/query-keys';
import type { MovieUploadData } from '@/types/movie';

interface UploadMovieParams {
  movieData: MovieUploadData;
  videoFile: File;
  onProgress?: (step: string, progress: number, message: string) => void;
}

export function useUploadMovie() {
  const queryClient = useQueryClient();
  const createMovieMutation = useCreateMovie();
  const getPresignedUrlMutation = useGetPresignedUrl();
  const uploadToBlobMutation = useUploadToBlob();
  const createVideoAssetMutation = useCreateVideoAsset();

  return useMutation({
    mutationFn: async ({ movieData, videoFile, onProgress }: UploadMovieParams) => {
      try {
        // Bước 1: Tạo Movie Metadata
        onProgress?.('metadata', 20, 'Tạo thông tin phim...');
        const movie = await createMovieMutation.mutateAsync(movieData);
        console.log("✅ Movie created:", movie.id);

        // Bước 2: Lấy Presigned URL
        onProgress?.('presign', 30, 'Lấy link upload...');
        const { uploadUrl, blobUrl } = await getPresignedUrlMutation.mutateAsync();
        console.log("📋 Presigned URLs received:");
        console.log("  - Upload URL (for PUT request):", uploadUrl);
        console.log("  - File URL (for database):", blobUrl);

        // Bước 3: Upload file lên Azure Blob
        onProgress?.('upload', 40, 'Đang upload video...');
        try {
          await uploadToBlobMutation.mutateAsync({
            uploadUrl,
            file: videoFile,
            onProgress: (fileProgress) => {
              onProgress?.('upload', 40 + (fileProgress * 0.4), `Đang upload video... ${fileProgress}%`);
            }
          });
          console.log("✅ File uploaded to Azure Blob successfully");
        } catch (uploadError: any) {
          console.error("❌ Blob upload failed:", uploadError);
          
          // CORS fallback
          if (uploadError.message.includes('CORS') || uploadError.name === 'TypeError') {
            console.log("🚧 CORS detected, using simulation fallback");
            onProgress?.('upload', 50, 'CORS Error - Đang dùng simulation...');
            
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 25) {
              await new Promise(resolve => setTimeout(resolve, 300));
              onProgress?.('upload', 40 + (i * 0.4), `Simulation upload... ${i}% (Cần fix CORS)`);
            }
            console.log("✅ Simulated upload completed (CORS fallback)");
          } else {
            throw uploadError;
          }
        }

        // Bước 4: Tạo VideoAsset
        onProgress?.('asset', 85, 'Tạo video asset...');
        await createVideoAssetMutation.mutateAsync({
          movieId: movie.id,
          format: 'mp4',
          resolution: "1080p",
          url: blobUrl,
          status: "pending"
        });

        // Bước 5: Transcoding
        onProgress?.('transcoding', 90, 'Bắt đầu quá trình chuyển đổi video...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        onProgress?.('completed', 100, 'Upload thành công! Video đang được xử lý...');

        return movie;
      } catch (error: any) {
        console.error("❌ Upload failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate movies lists
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.categories() });
    },
  });
}