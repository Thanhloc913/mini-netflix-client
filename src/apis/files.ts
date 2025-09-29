import { apiClient } from "@/apis/api-client";

export class FileError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "FileError";
  }
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  blobUrl: string;
}

export const filesApi = {
  // Get presigned URL for movie upload via gateway to file service
  getPresignedUrl: async (): Promise<PresignedUrlResponse> => {
    try {
      console.log("📁 Getting presigned URL for movie upload...");
      const response = await apiClient.post<PresignedUrlResponse>("/file/files/presign-movie");
      console.log("✅ Presigned URL obtained:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to get presigned URL:", error);
      throw new FileError(
        error.response?.data?.message || "Failed to get presigned URL",
        error.response?.status
      );
    }
  },

  // Upload video file to Azure using presigned URL
  uploadToBlob: async (uploadUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> => {
    try {
      console.log("📤 Uploading video file to Azure...");
      
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "video/mp4",
          "x-ms-blob-type": "BlockBlob",
          "Content-Length": file.size.toString(),
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      console.log("✅ Video file uploaded successfully");
      onProgress?.(100);
    } catch (error: any) {
      console.error("❌ Failed to upload video file:", error);
      throw new FileError(
        error.message || "Failed to upload video file"
      );
    }
  },
};