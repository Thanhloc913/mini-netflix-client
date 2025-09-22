import { apiClient } from "@/apis/api-client";
import type { Movie, MovieCategory, MoviesResponse } from "@/types/movie";

export class MovieError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "MovieError";
  }
}

export const moviesApi = {
  // Get all movies - chỉ dùng API /movie/movies
  getAllMovies: async (page = 1, limit = 20): Promise<MoviesResponse> => {
    try {
      console.log("🎬 Fetching movies from API...");
      const response = await apiClient.get("/movie/movies", {
        params: { page, limit }
      });
      console.log("✅ Raw API response:", response.data);

      // Kiểm tra cấu trúc response từ console log
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // API trả về structure: { data: [...], meta: {...} }
        console.log("📦 Response has data property with array, found", response.data.data.length, "movies");
        return {
          movies: response.data.data,
          total: response.data.meta?.total || response.data.data.length,
          page: response.data.meta?.page || page,
          limit: response.data.meta?.limit || limit
        };
      } else if (Array.isArray(response.data)) {
        // Nếu response trả về array trực tiếp
        console.log("📦 Response is array, found", response.data.length, "movies");
        return {
          movies: response.data,
          total: response.data.length,
          page: page,
          limit: limit
        };
      } else if (response.data && response.data.movies) {
        // Nếu response có structure như expected
        console.log("📦 Response has movies property, found", response.data.movies.length, "movies");
        return response.data;
      } else {
        console.error("❌ Unexpected response structure:", response.data);
        console.log("📦 Available keys:", Object.keys(response.data || {}));

        // Thử extract data từ bất kỳ property nào có array
        const dataKeys = Object.keys(response.data || {});
        for (const key of dataKeys) {
          if (Array.isArray(response.data[key])) {
            console.log(`📦 Found array in property: ${key}, with ${response.data[key].length} items`);
            return {
              movies: response.data[key],
              total: response.data[key].length,
              page: page,
              limit: limit
            };
          }
        }

        throw new MovieError("No movie data found in response");
      }
    } catch (error: any) {
      console.error("❌ API call failed:", error);

      // Chỉ fallback khi có lỗi thực sự (network, server error)
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        console.log("🔄 Using mock data fallback due to server error");
        const mockMovies: Movie[] = [
          {
            id: "mock-1",
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
            id: "mock-2",
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
            id: "mock-3",
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

        return {
          movies: mockMovies,
          total: mockMovies.length,
          page: page,
          limit: limit
        };
      }

      // Nếu không phải server error, throw lại để component handle
      throw error;
    }
  },

  // Get featured movies for hero section - ALWAYS use mock data
  getFeaturedMovies: async (): Promise<Movie[]> => {
    console.log("🎬 Using mock featured movies for hero section (no API call)");

    // Always return mock data for hero section - no API call
    const mockFeaturedMovies: Movie[] = [
      {
        id: "hero-1",
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
        id: "hero-2",
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
        id: "hero-3",
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

  // Get movie categories - dựa trên getAllMovies
  getMovieCategories: async (): Promise<MovieCategory[]> => {
    try {
      const response = await moviesApi.getAllMovies(1, 20);
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
    } catch (error: any) {
      console.error("❌ Failed to get movie categories:", error);
      // Trả về mảng rỗng khi API fail
      return [];
    }
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
  searchMovies: async (
    query: string,
    page = 1,
    limit = 20
  ): Promise<MoviesResponse> => {
    try {
      if (!query.trim()) {
        return { movies: [], total: 0, page, limit };
      }

      console.log("🔍 Searching movies from API...");
      const response = await apiClient.get("/movie/movies/search", {
        params: { keyword: query, page, limit }
      });

      console.log("✅ Search API response:", response.data);

      // Xử lý response structure từ API search
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log("📦 Search found", response.data.data.length, "movies");
        return {
          movies: response.data.data,
          total: response.data.meta?.total || response.data.data.length,
          page: response.data.meta?.page || page,
          limit: response.data.meta?.limit || limit,
        };
      } else if (Array.isArray(response.data)) {
        // Fallback nếu response trả về array trực tiếp
        console.log("📦 Search response is array, found", response.data.length, "movies");
        return {
          movies: response.data,
          total: response.data.length,
          page,
          limit,
        };
      } else {
        console.error("❌ Unexpected search response structure:", response.data);
        return { movies: [], total: 0, page, limit };
      }
    } catch (error: any) {
      console.error("❌ Search API failed:", error);

      // Fallback với mock data nếu có lỗi server
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        console.log("🔄 Using mock search fallback");
        const mockMovies: Movie[] = [
          {
            id: "mock-search-1",
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
          }
        ].filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.description.toLowerCase().includes(query.toLowerCase())
        );

        return {
          movies: mockMovies,
          total: mockMovies.length,
          page,
          limit
        };
      }

      return { movies: [], total: 0, page, limit };
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

  // Create new movie
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
  },

  // Update movie
  updateMovie: async (id: string, movieData: any): Promise<Movie> => {
    try {
      console.log("🎬 Updating movie:", id);
      const response = await apiClient.put<Movie>(`/movie/movies/${id}`, movieData);
      console.log("✅ Movie updated:", response.data.id);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to update movie:", error);
      throw new MovieError(
        error.response?.data?.message || "Failed to update movie",
        error.response?.status
      );
    }
  },

  // Delete movie
  deleteMovie: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting movie:", id);
      await apiClient.delete(`/movie/movies/${id}`);
      console.log("✅ Movie deleted:", id);
    } catch (error: any) {
      console.error("❌ Failed to delete movie:", error);
      throw new MovieError(
        error.response?.data?.message || "Failed to delete movie",
        error.response?.status
      );
    }
  }
};