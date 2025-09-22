import { MovieCard } from "@/components/MovieCard";
import type { Movie } from "@/types/movie";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMoviePlay?: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onMoviePlay }: MovieRowProps) {
  return (
    <div className="mb-8 relative">
      <h2 className="text-white text-xl font-semibold mb-4 relative z-10">{title}</h2>
      <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 scrollbar-hide relative">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-48 relative">
            <MovieCard movie={movie} onPlay={onMoviePlay} />
          </div>
        ))}
      </div>
    </div>
  );
}