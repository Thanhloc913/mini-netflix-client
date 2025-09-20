export interface Genre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  movies?: Movie[];
}

export interface CreateGenreRequest {
  name: string;
}

export interface UpdateGenreRequest {
  name?: string;
}

export interface GenresResponse {
  data: Genre[];
  total?: number;
}

// Import Movie type if needed
import type { Movie } from './movie';