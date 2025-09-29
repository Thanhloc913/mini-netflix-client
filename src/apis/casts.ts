import { apiClient } from "@/apis/api-client";
import type { Cast, CreateCastRequest, UpdateCastRequest } from "@/types/cast";

export class CastError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "CastError";
  }
}

export const castsApi = {
  // Get all casts
  getAllCasts: async (): Promise<Cast[]> => {
    try {
      console.log("👥 Fetching casts from API...");
      const response = await apiClient.get("/casts");
      console.log("✅ Casts fetched:", response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error: any) {
      console.error("❌ Failed to fetch casts:", error);
      throw new CastError(
        error.response?.data?.message || "Failed to fetch casts",
        error.response?.status
      );
    }
  },

  // Get cast by ID
  getCastById: async (id: string): Promise<Cast | null> => {
    try {
      console.log("👥 Fetching cast by ID:", id);
      const response = await apiClient.get<Cast>(`/casts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch cast by ID:", error);
      return null;
    }
  },

  // Create new cast
  createCast: async (castData: CreateCastRequest): Promise<Cast> => {
    try {
      console.log("👥 Creating cast:", castData);
      const response = await apiClient.post<Cast>("/casts", castData);
      console.log("✅ Cast created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to create cast:", error);
      throw new CastError(
        error.response?.data?.message || "Failed to create cast",
        error.response?.status
      );
    }
  },

  // Update cast
  updateCast: async (id: string, castData: UpdateCastRequest): Promise<Cast> => {
    try {
      console.log("👥 Updating cast:", id, castData);
      const response = await apiClient.patch<Cast>(`/casts/${id}`, castData);
      console.log("✅ Cast updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to update cast:", error);
      throw new CastError(
        error.response?.data?.message || "Failed to update cast",
        error.response?.status
      );
    }
  },

  // Delete cast
  deleteCast: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting cast:", id);
      await apiClient.delete(`/casts/${id}`);
      console.log("✅ Cast deleted:", id);
    } catch (error: any) {
      console.error("❌ Failed to delete cast:", error);
      throw new CastError(
        error.response?.data?.message || "Failed to delete cast",
        error.response?.status
      );
    }
  }
};