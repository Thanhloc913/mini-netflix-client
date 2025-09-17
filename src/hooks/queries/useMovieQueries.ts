import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { moviesApi } from '@/apis/movies';
import { queryKeys } from '@/lib/query-keys';
import type { MovieUploadData } from '@/types/movie';

// Get movies with pagination
export function useMovies(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: queryKeys.movies.list(page, limit),
    queryFn: () => moviesApi.getAllMovies(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Infinite query cho pagination
export function useInfiniteMovies(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: queryKeys.movies.lists(),
    queryFn: ({ pageParam = 1 }) => moviesApi.getAllMovies(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / limit);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Get featured movies
export function useFeaturedMovies() {
  return useQuery({
    queryKey: queryKeys.movies.featured(),
    queryFn: moviesApi.getFeaturedMovies,
    staleTime: 10 * 60 * 1000, // 10 minutes (featured movies change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Get movie categories
export function useMovieCategories() {
  return useQuery({
    queryKey: queryKeys.movies.categories(),
    queryFn: moviesApi.getMovieCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Get single movie by ID
export function useMovie(id: string) {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: () => moviesApi.getMovieById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Search movies
export function useMovieSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.movies.search(query),
    queryFn: () => moviesApi.searchMovies(query),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes (search results change more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get trending movies
export function useTrendingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.trending(),
    queryFn: moviesApi.getTrendingMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

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

// Combined hook for home page
export function useHomeMovies() {
  const featuredQuery = useFeaturedMovies();
  const categoriesQuery = useMovieCategories();

  return {
    featuredMovies: featuredQuery.data || [],
    movieCategories: categoriesQuery.data || [],
    isLoading: featuredQuery.isLoading || categoriesQuery.isLoading,
    error: featuredQuery.error || categoriesQuery.error,
    refetch: () => {
      featuredQuery.refetch();
      categoriesQuery.refetch();
    },
  };
}