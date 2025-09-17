import { apiClient } from "@/apis/api-client";

export class FileError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "FileError";
  }
}

export interface VideoAssetRequest {
  movieId: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  resolution?: string;
  format: "mp4";
  url?: string;
  status?: string;
  quality?: string;
}

export interface VideoAsset {
  id: string;
  movieId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  duration?: number;
  resolution?: string;
  quality?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  blobUrl: string;
}

export const filesApi = {
  // Get presigned URL for file upload
  getPresignedUrl: async (request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    try {
      console.log("📤 Getting presigned URL for:", request.fileName);
      const response = await apiClient.post<PresignedUrlResponse>("/file/files/presign-movie", request);
      console.log("✅ Presigned URL obtained");
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to get presigned URL:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to get presigned URL",
        error.response?.status
      );
    }
  },

  // Upload file to blob storage using presigned URL
  uploadToBlob: async (
    uploadUrl: string,
    file: File,
    _onProgress?: (progress: number) => void
  ): Promise<void> => {
    try {
      console.log("📤 Uploading file to blob storage...");
      console.log("📤 Upload URL:", uploadUrl);
      console.log("📤 File type:", file.type);
      console.log("📤 File size:", file.size);

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-ms-blob-type': 'BlockBlob',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Upload response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log("✅ File uploaded to blob storage");
    } catch (error: any) {
      console.error("❌ Failed to upload to blob:", error);

      // Check if it's a CORS or header issue
      if (error.message.includes('CORS') || error.message.includes('header')) {
        console.log("🚧 Detected CORS/header issue, this is expected in development");
        console.log("🚧 In production, make sure:");
        console.log("  1. Azure Blob CORS is configured for your domain");
        console.log("  2. Presigned URL includes all required headers");
        console.log("  3. x-ms-blob-type header is accepted");
      }

      throw new FileError(error.message || "Failed to upload file");
    }
  },

  // Create video asset record
  createVideoAsset: async (request: VideoAssetRequest): Promise<VideoAsset> => {
    try {
      console.log("🎬 Creating video asset record...");
      const response = await apiClient.post<VideoAsset>("/movie/video-assets", request);
      console.log("✅ Video asset created:", response.data.id);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to create video asset:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to create video asset",
        error.response?.status
      );
    }
  },

  // Get video assets for a movie
  getVideoAssets: async (movieId: string): Promise<VideoAsset[]> => {
    try {
      console.log("🎬 Getting video assets for movie:", movieId);
      const response = await apiClient.get<VideoAsset[]>(`/file/files/video-assets/movie/${movieId}`);
      console.log("✅ Video assets retrieved:", response.data.length);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to get video assets:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to get video assets",
        error.response?.status
      );
    }
  },

  // Delete video asset
  deleteVideoAsset: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting video asset:", id);
      await apiClient.delete(`/file/files/video-assets/${id}`);
      console.log("✅ Video asset deleted:", id);
    } catch (error: any) {
      console.error("❌ Failed to delete video asset:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to delete video asset",
        error.response?.status
      );
    }
  }
};