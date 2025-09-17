// Re-export queries
export { 
  useHomeMovies as useMovies,
  useMovieSearch,
  useInfiniteMovies,
  useFeaturedMovies,
  useMovieCategories,
  useMovie,
  useTrendingMovies
} from '@/hooks/queries/useMovieQueries';

// Re-export mutations
export {
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie
} from '@/hooks/mutations/useMovieMutations';