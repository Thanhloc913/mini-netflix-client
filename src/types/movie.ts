export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number | null;
  isSeries: boolean;
  posterUrl: string;
  trailerUrl: string | null;
  videoAssets: any[];
  rating: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  episodes: any[];
  genres: any[];
  casts: any[];
}

export interface MovieCategory {
  id: string;
  name: string;
  movies: Movie[];
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
}