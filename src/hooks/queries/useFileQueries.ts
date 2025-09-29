import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '@/apis/movies';
import { queryKeys } from '@/lib/query-keys';

// Get video assets for a movie
export function useVideoAssets(movieId: string) {
  return useQuery({
    queryKey: queryKeys.files.videoAssets(movieId),
    queryFn: () => moviesApi.getVideoAssets(movieId),
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}