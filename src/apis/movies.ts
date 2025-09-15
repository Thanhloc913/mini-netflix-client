import { apiClient } from "@/apis/api-client";
import type { Movie, MovieCategory, MoviesResponse } from "@/types/movie";

export class MovieError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "MovieError";
  }
}



export const moviesApi = {
  // Get all movies
  getAllMovies: async (page = 1, limit = 20): Promise<MoviesResponse> => {
    console.log("🎬 Fetching movies from API...");
    const response = await apiClient.get("/movie/movies", {
      params: { page, limit }
    });
    console.log("✅ Raw API response:", response.data);
    
    // Kiểm tra cấu trúc response
    if (Array.isArray(response.data)) {
      // Nếu response trả về array trực tiếp
      console.log("📦 Response is array, converting to MoviesResponse format");
      return {
        movies: response.data,
        total: response.data.length,
        page: page,
        limit: limit
      };
    } else if (response.data.movies) {
      // Nếu response có structure như expected
      console.log("📦 Response has movies property");
      return response.data;
    } else {
      console.error("❌ Unexpected response structure:", response.data);
      throw new Error("Invalid response structure");
    }
  },

  // Get featured movies for hero section (using mock data for now)
  getFeaturedMovies: async (): Promise<Movie[]> => {
    // Mock data for hero section
    const mockFeaturedMovies: Movie[] = [
      {
        id: "1",
        title: "Gachakuza",
        description: "Bị buộc tội giết người và nằm xuống hố, đứa trẻ mồ côi nọ gặp nhóm chiến binh quái vật có sức mạnh đặc biệt để khám phá sự thật.",
        releaseDate: "2024-01-01",
        duration: 24,
        isSeries: true,
        posterUrl: "https://gachiakuta-anime.com/assets/img/top/main/kv.jpg",
        trailerUrl: null,
        videoAssets: [],
        rating: "8.7",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        deletedAt: null,
        episodes: [],
        genres: [{ name: "Action" }, { name: "Fantasy" }],
        casts: []
      },
      {
        id: "2",
        title: "Hoa Thơm Kiêu Hãnh",
        description: "Một câu chuyện tình yêu đầy cảm xúc về những người trẻ tìm kiếm ý nghĩa cuộc sống qua những mối quan hệ phức tạp.",
        releaseDate: "2024-02-01",
        duration: 24,
        isSeries: true,
        posterUrl: "https://image.tmdb.org/t/p/w1280/cRtyoypoIfrW8SWyVw0y554xWQ.jpg",
        trailerUrl: null,
        videoAssets: [],
        rating: "8.4",
        createdAt: "2024-02-01",
        updatedAt: "2024-02-01",
        deletedAt: null,
        episodes: [],
        genres: [{ name: "Romance" }, { name: "Drama" }],
        casts: []
      },
      {
        id: "3",
        title: "7 Viên Ngọc Rồng",
        description: "Cuộc phiêu lưu của Goku.",
        releaseDate: "2024-03-01",
        duration: 24,
        isSeries: true,
        posterUrl: "https://images-na.ssl-images-amazon.com/images/I/810juzDPc1L.jpg",
        trailerUrl: null,
        videoAssets: [],
        rating: "8.5",
        createdAt: "2024-03-01",
        updatedAt: "2024-03-01",
        deletedAt: null,
        episodes: [],
        genres: [{ name: "Fantasy" }, { name: "Adventure" }],
        casts: []
      }
    ];
    
    return mockFeaturedMovies;
  },

  // Get movie categories (group movies by different criteria)
  getMovieCategories: async (): Promise<MovieCategory[]> => {
    const response = await moviesApi.getAllMovies(1, 50);
    const movies = response.movies;

    // Tạo categories từ movies
    const categories: MovieCategory[] = [
      {
        id: "latest",
        name: "Mới nhất",
        movies: movies.slice(0, 10)
      },
      {
        id: "series",
        name: "Phim bộ",
        movies: movies.filter(movie => movie.isSeries).slice(0, 10)
      },
      {
        id: "movies",
        name: "Phim lẻ", 
        movies: movies.filter(movie => !movie.isSeries).slice(0, 10)
      },
      {
        id: "high-rated",
        name: "Đánh giá cao",
        movies: movies.filter(movie => parseFloat(movie.rating) >= 8).slice(0, 10)
      }
    ];

    return categories.filter(cat => cat.movies.length > 0);
  },

  // Get movies by category
  getMoviesByCategory: async (categoryId: string): Promise<Movie[]> => {
    try {
      const categories = await moviesApi.getMovieCategories();
      const category = categories.find(cat => cat.id === categoryId);
      return category?.movies || [];
    } catch (error) {
      console.error("Failed to fetch movies by category:", error);
      return [];
    }
  },

  // Get single movie by ID
  getMovieById: async (id: string): Promise<Movie | null> => {
    try {
      const response = await apiClient.get<Movie>(`/movie/movies/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch movie by ID:", error);
      return null;
    }
  },

  // Search movies
  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      if (!query.trim()) return [];
      
      const response = await moviesApi.getAllMovies(1, 50);
      const lowercaseQuery = query.toLowerCase();
      
      return response.movies.filter(movie => 
        movie.title.toLowerCase().includes(lowercaseQuery) ||
        movie.description.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error("Failed to search movies:", error);
      return [];
    }
  },

  // Get trending movies (latest movies)
  getTrendingMovies: async (): Promise<Movie[]> => {
    try {
      const response = await moviesApi.getAllMovies(1, 10);
      return response.movies;
    } catch (error) {
      console.error("Failed to fetch trending movies:", error);
      return [];
    }
  },

  // Create new movie (Bước 1: Tạo Movie Metadata)
  createMovie: async (movieData: any): Promise<Movie> => {
    try {
      console.log("🎬 Creating movie metadata...");
      const response = await apiClient.post<Movie>("/movie/movies", movieData);
      console.log("✅ Movie metadata created:", response.data.id);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to create movie:", error);
      throw new MovieError(
        error.response?.data?.message || "Failed to create movie",
        error.response?.status
      );
    }
  }
};