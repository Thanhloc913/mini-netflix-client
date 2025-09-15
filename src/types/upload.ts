export interface MovieUploadData {
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  isSeries: boolean;
  posterUrl?: string;
  trailerUrl?: string;
  genreIds: string[];
  castIds: string[];
}

export interface UploadProgress {
  step: 'metadata' | 'presign' | 'upload' | 'asset' | 'transcoding' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: UploadProgress;
  movieId?: string;
  videoFile?: File;
}