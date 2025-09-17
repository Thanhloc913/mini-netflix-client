import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesApi } from '@/apis/movies';
import { queryKeys } from '@/lib/query-keys';
import type { MovieUploadData } from '@/types/movie';

// Create movie mutation
export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieData: MovieUploadData) => moviesApi.createMovie(movieData),
    onSuccess: (newMovie) => {
      // Invalidate movies lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.trending() });
      
      // Add new movie to cache
      queryClient.setQueryData(queryKeys.movies.detail(newMovie.id), newMovie);
    },
  });
}

// Update movie mutation
export function useUpdateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MovieUploadData> }) => 
      moviesApi.updateMovie(id, data),
    onSuccess: (updatedMovie) => {
      // Update specific movie cache
      queryClient.setQueryData(queryKeys.movies.detail(updatedMovie.id), updatedMovie);
      
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.categories() });
    },
  });
}

// Delete movie mutation
export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => moviesApi.deleteMovie(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.movies.detail(deletedId) });
      
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.trending() });
    },
  });
}