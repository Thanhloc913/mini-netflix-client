// Re-export từ query hooks để maintain backward compatibility
export { 
  useHomeMovies as useMovies,
  useMovieSearch,
  useInfiniteMovies,
  useFeaturedMovies,
  useMovieCategories,
  useMovie,
  useTrendingMovies,
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie
} from '@/hooks/queries/useMovieQueries';