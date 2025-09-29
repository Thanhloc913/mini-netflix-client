import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '@/apis/movies';

// Get HLS assets for streaming
export function useHLSAssets(movieId: string) {
  return useQuery({
    queryKey: ['hls-assets', movieId],
    queryFn: () => moviesApi.getHLSAssets(movieId),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Get seek-optimized HLS assets
export function useSeekOptimizedHLS(movieId: string) {
  return useQuery({
    queryKey: ['seek-optimized-hls', movieId],
    queryFn: () => moviesApi.getSeekOptimizedHLS(movieId),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Get video assets for a movie
export function useVideoAssets(movieId: string) {
  return useQuery({
    queryKey: ['video-assets', movieId],
    queryFn: () => moviesApi.getVideoAssets(movieId),
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}