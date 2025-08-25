import { MOCK_MOVIES, MOVIE_CATEGORIES, type Movie, type MovieCategory } from "@/mock/movies";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const moviesApi = {
  // Get featured movies for hero section
  getFeaturedMovies: async (): Promise<Movie[]> => {
    await delay(500);
    return MOCK_MOVIES.filter(movie => movie.featured);
  },

  // Get all movie categories
  getMovieCategories: async (): Promise<MovieCategory[]> => {
    await delay(300);
    return MOVIE_CATEGORIES;
  },

  // Get movies by category
  getMoviesByCategory: async (categoryId: string): Promise<Movie[]> => {
    await delay(300);
    const category = MOVIE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.movies || [];
  },

  // Get single movie by ID
  getMovieById: async (id: string): Promise<Movie | null> => {
    await delay(200);
    return MOCK_MOVIES.find(movie => movie.id === id) || null;
  },

  // Search movies
  searchMovies: async (query: string): Promise<Movie[]> => {
    await delay(400);
    const lowercaseQuery = query.toLowerCase();
    return MOCK_MOVIES.filter(movie => 
      movie.title.toLowerCase().includes(lowercaseQuery) ||
      movie.description.toLowerCase().includes(lowercaseQuery) ||
      movie.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Get trending movies
  getTrendingMovies: async (): Promise<Movie[]> => {
    await delay(300);
    return MOCK_MOVIES.slice(0, 6);
  }
};