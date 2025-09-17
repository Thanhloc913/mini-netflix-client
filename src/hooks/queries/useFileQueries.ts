import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '@/apis/files';
import { queryKeys } from '@/lib/query-keys';
import type { VideoAssetRequest, PresignedUrlRequest } from '@/apis/files';

// Get presigned URL mutation
export function useGetPresignedUrl() {
  return useMutation({
    mutationFn: (request: PresignedUrlRequest) => filesApi.getPresignedUrl(request),
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
    mutationFn: (request: VideoAssetRequest) => filesApi.createVideoAsset(request),
    onSuccess: (videoAsset) => {
      // Invalidate video assets for this movie
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.files.videoAssets(videoAsset.movieId) 
      });
    },
  });
}

// Get video assets for a movie
export function useVideoAssets(movieId: string) {
  return useQuery({
    queryKey: queryKeys.files.videoAssets(movieId),
    queryFn: () => filesApi.getVideoAssets(movieId),
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}