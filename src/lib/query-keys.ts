// Query keys cho TanStack Query
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: (userId: string) => [...queryKeys.auth.all, 'user', userId] as const,
    profile: (userId: string) => [...queryKeys.auth.all, 'profile', userId] as const,
    accounts: () => [...queryKeys.auth.all, 'accounts'] as const,
    profiles: () => [...queryKeys.auth.all, 'profiles'] as const,
  },

  // Movies queries
  movies: {
    all: ['movies'] as const,
    lists: () => [...queryKeys.movies.all, 'list'] as const,
    list: (page: number, limit: number) => [...queryKeys.movies.lists(), page, limit] as const,
    details: () => [...queryKeys.movies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.movies.details(), id] as const,
    featured: () => [...queryKeys.movies.all, 'featured'] as const,
    categories: () => [...queryKeys.movies.all, 'categories'] as const,
    search: (query: string) => [...queryKeys.movies.all, 'search', query] as const,
    trending: () => [...queryKeys.movies.all, 'trending'] as const,
  },

  // Files queries
  files: {
    all: ['files'] as const,
    presign: () => [...queryKeys.files.all, 'presign'] as const,
    videoAssets: (movieId: string) => [...queryKeys.files.all, 'video-assets', movieId] as const,
  },
} as const;