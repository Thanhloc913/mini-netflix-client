// Re-export genre queries
export { 
  useGenres,
  useGenre
} from '@/hooks/queries/useGenreQueries';

// Re-export genre mutations
export {
  useCreateGenre,
  useUpdateGenre,
  useDeleteGenre
} from '@/hooks/mutations/useGenreMutations';