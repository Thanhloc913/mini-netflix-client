import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genresApi } from '@/apis/genres';
import { genreQueryKeys } from '@/hooks/queries/useGenreQueries';
import type { CreateGenreRequest, UpdateGenreRequest } from '@/types/genre';

// Create genre mutation
export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGenreRequest) => genresApi.createGenre(data),
    onSuccess: () => {
      // Invalidate and refetch genres list
      queryClient.invalidateQueries({ queryKey: genreQueryKeys.lists() });
    },
  });
}

// Update genre mutation
export function useUpdateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGenreRequest }) =>
      genresApi.updateGenre(id, data),
    onSuccess: (updatedGenre) => {
      // Invalidate and refetch genres list
      queryClient.invalidateQueries({ queryKey: genreQueryKeys.lists() });
      // Update the specific genre in cache
      queryClient.setQueryData(
        genreQueryKeys.detail(updatedGenre.id),
        updatedGenre
      );
    },
  });
}

// Delete genre mutation
export function useDeleteGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => genresApi.deleteGenre(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch genres list
      queryClient.invalidateQueries({ queryKey: genreQueryKeys.lists() });
      // Remove the specific genre from cache
      queryClient.removeQueries({ queryKey: genreQueryKeys.detail(deletedId) });
    },
  });
}