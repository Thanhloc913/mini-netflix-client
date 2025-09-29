import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '@/apis/files';
import { moviesApi } from '@/apis/movies';
import { queryKeys } from '@/lib/query-keys';
import type { VideoAssetRequest } from '@/apis/movies';

// Get presigned URL mutation
export function useGetPresignedUrl() {
  return useMutation({
    mutationFn: () => filesApi.getPresignedUrl(),
  });
}

// Upload to blob mutation
export function useUploadToBlob() {
  return useMutation({
    mutationFn: ({ uploadUrl, file, onProgress }: {
      uploadUrl: string;
      file: File;
      onProgress?: (progress: number) => void
    }) => filesApi.uploadToBlob(uploadUrl, file, onProgress),
  });
}

// Create video asset mutation
export function useCreateVideoAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VideoAssetRequest) => moviesApi.createVideoAsset(request),
    onSuccess: (videoAsset) => {
      // Invalidate video assets for this movie
      queryClient.invalidateQueries({
        queryKey: ['video-assets', videoAsset.movieId]
      });
    },
  });
}