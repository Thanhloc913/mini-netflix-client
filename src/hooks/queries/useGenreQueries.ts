import { useQuery } from '@tanstack/react-query';
import { genresApi } from '@/apis/genres';

export const genreQueryKeys = {
  all: ['genres'] as const,
  lists: () => [...genreQueryKeys.all, 'list'] as const,
  list: () => [...genreQueryKeys.lists()] as const,
  details: () => [...genreQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...genreQueryKeys.details(), id] as const,
};

// Get all genres
export function useGenres() {
  return useQuery({
    queryKey: genreQueryKeys.list(),
    queryFn: genresApi.getAllGenres,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single genre
export function useGenre(id: string) {
  return useQuery({
    queryKey: genreQueryKeys.detail(id),
    queryFn: () => genresApi.getGenreById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}