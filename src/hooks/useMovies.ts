import { useState, useEffect } from "react";
import { moviesApi } from "@/apis/movies";
import type { Movie, MovieCategory } from "@/mock/movies";

export function useMovies() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [movieCategories, setMovieCategories] = useState<MovieCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [featured, categories] = await Promise.all([
          moviesApi.getFeaturedMovies(),
          moviesApi.getMovieCategories()
        ]);
        
        setFeaturedMovies(featured);
        setMovieCategories(categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return {
    featuredMovies,
    movieCategories,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-run the effect
    }
  };
}

export function useMovieSearch(query: string) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResults = await moviesApi.searchMovies(query);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Tìm kiếm thất bại");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search với 500ms
    const debounceTimer = setTimeout(searchMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
}