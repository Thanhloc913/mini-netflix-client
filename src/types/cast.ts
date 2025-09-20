export interface Cast {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  movies?: Movie[];
}

export interface CreateCastRequest {
  name: string;
  role: string;
}

export interface UpdateCastRequest {
  name?: string;
  role?: string;
}

export interface CastsResponse {
  data: Cast[];
  total?: number;
}

// Import Movie type if needed
import type { Movie } from './movie';