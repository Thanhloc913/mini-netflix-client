import { useState } from "react";
import { useUploadMovie } from "@/hooks/queries/useUploadMutation";
import type { MovieUploadData } from "@/types/movie";

export interface UploadState {
  isUploading: boolean;
  progress: number;
  step: string;
  message: string;
  error: string | null;
}

export function useMovieUpload() {
  const uploadMovieMutation = useUploadMovie();

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    step: "",
    message: "",
    error: null,
  });

  const updateProgress = (step: string, progress: number, message: string) => {
    setUploadState((prev: UploadState) => ({
      ...prev,
      step,
      progress,
      message,
    }));
  };

  const uploadMovie = async (movieData: MovieUploadData, videoFile: File) => {
    try {
      setUploadState((prev: UploadState) => ({ ...prev, isUploading: true }));

      const result = await uploadMovieMutation.mutateAsync({
        movieData,
        videoFile,
        onProgress: updateProgress,
      });

      setUploadState((prev: UploadState) => ({ ...prev, isUploading: false }));
      return result;
    } catch (error: any) {
      setUploadState((prev: UploadState) => ({
        ...prev,
        isUploading: false,
        error: error.message || "Upload failed",
      }));
      throw error;
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      step: "",
      message: "",
      error: null,
    });
  };

  return {
    uploadMovie,
    uploadState,
    resetUpload,
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    step: uploadState.step,
    message: uploadState.message,
    error: uploadState.error,
  };
}