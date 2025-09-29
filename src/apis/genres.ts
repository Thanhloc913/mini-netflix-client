import { apiClient } from "@/apis/api-client";
import type { Genre, CreateGenreRequest, UpdateGenreRequest } from "@/types/genre";

export class GenreError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "GenreError";
  }
}

export const genresApi = {
  // Get all genres
  getAllGenres: async (): Promise<Genre[]> => {
    try {
      console.log("🎭 Fetching genres from API...");
      const response = await apiClient.get("/genres");
      console.log("✅ Genres fetched:", response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error: any) {
      console.error("❌ Failed to fetch genres:", error);
      throw new GenreError(
        error.response?.data?.message || "Failed to fetch genres",
        error.response?.status
      );
    }
  },

  // Get genre by ID
  getGenreById: async (id: string): Promise<Genre | null> => {
    try {
      console.log("🎭 Fetching genre by ID:", id);
      const response = await apiClient.get<Genre>(`/genres/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch genre by ID:", error);
      return null;
    }
  },

  // Create new genre
  createGenre: async (genreData: CreateGenreRequest): Promise<Genre> => {
    try {
      console.log("🎭 Creating genre:", genreData);
      const response = await apiClient.post<Genre>("/genres", genreData);
      console.log("✅ Genre created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to create genre:", error);
      throw new GenreError(
        error.response?.data?.message || "Failed to create genre",
        error.response?.status
      );
    }
  },

  // Update genre
  updateGenre: async (id: string, genreData: UpdateGenreRequest): Promise<Genre> => {
    try {
      console.log("🎭 Updating genre:", id, genreData);
      const response = await apiClient.patch<Genre>(`/genres/${id}`, genreData);
      console.log("✅ Genre updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to update genre:", error);
      throw new GenreError(
        error.response?.data?.message || "Failed to update genre",
        error.response?.status
      );
    }
  },

  // Delete genre
  deleteGenre: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting genre:", id);
      await apiClient.delete(`/genres/${id}`);
      console.log("✅ Genre deleted:", id);
    } catch (error: any) {
      console.error("❌ Failed to delete genre:", error);
      throw new GenreError(
        error.response?.data?.message || "Failed to delete genre",
        error.response?.status
      );
    }
  }
};