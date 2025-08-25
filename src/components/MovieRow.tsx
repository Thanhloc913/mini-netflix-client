import { MovieCard } from "@/components/MovieCard";
import type { Movie } from "@/mock/movies";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMoviePlay?: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onMoviePlay }: MovieRowProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-48">
            <MovieCard movie={movie} onPlay={onMoviePlay} />
          </div>
        ))}
      </div>
    </div>
  );
}