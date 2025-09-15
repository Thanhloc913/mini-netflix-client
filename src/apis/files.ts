import { apiClient } from "@/apis/api-client";

export interface PresignedUrlResponse {
  uploadUrl: string;
  blobUrl: string;
}

export interface VideoAssetRequest {
  movieId: string;
  resolution: string;
  format: string;
  url: string;
  status: "pending" | "processing" | "done" | "failed";
}

export interface VideoAsset {
  id: string;
  movieId: string;
  resolution: string;
  format: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class FileError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "FileError";
  }
}

export const filesApi = {
  // Bước 2: Lấy Presigned URL để upload file gốc
  getPresignedUrl: async (): Promise<PresignedUrlResponse> => {
    try {
      console.log("📁 Getting presigned URL for movie upload...");
      const response = await apiClient.post<PresignedUrlResponse>("/file/files/presign-movie");
      console.log("✅ Presigned URL received");
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to get presigned URL:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to get presigned URL",
        error.response?.status
      );
    }
  },

  // Bước 3: Upload file gốc lên Azure Blob
  uploadToBlob: async (uploadUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> => {
    try {
      console.log("📤 Uploading file to Azure Blob...");
      console.log("Upload URL:", uploadUrl);
      console.log("File info:", { name: file.name, size: file.size, type: file.type });
      
      // Progress simulation
      if (onProgress) {
        onProgress(10);
      }

      // Sử dụng fetch với proper headers cho Azure Blob
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'video/mp4',
          'x-ms-blob-type': 'BlockBlob'
        },
        mode: 'cors'
      });

      if (onProgress) {
        onProgress(50);
      }

      if (!response.ok) {
        console.error("❌ Upload failed:", response.status, response.statusText);
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error("Error details:", errorText);
        throw new FileError(`Upload failed: ${response.status} ${response.statusText}`);
      }

      if (onProgress) {
        onProgress(100);
      }

      console.log("✅ File uploaded to blob successfully");
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
    } catch (error: any) {
      console.error("❌ Failed to upload to blob:", error);
      
      // Check for specific error types
      if (error.name === 'TypeError' && (
        error.message.includes('CORS') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network request failed')
      )) {
        throw new FileError("CORS error: Server cần cấu hình CORS cho Azure Blob Storage");
      }
      
      throw new FileError(error.message || "Failed to upload file");
    }
  },

  // Bước 4: Tạo VideoAsset gốc
  createVideoAsset: async (request: VideoAssetRequest): Promise<VideoAsset> => {
    try {
      console.log("🎬 Creating video asset...");
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

  // Lấy trạng thái video assets của một movie
  getVideoAssets: async (movieId: string): Promise<VideoAsset[]> => {
    try {
      const response = await apiClient.get<VideoAsset[]>(`/movie/video-assets/movie/${movieId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to get video assets:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to get video assets",
        error.response?.status
      );
    }
  }
};