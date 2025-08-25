import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/mock/movies";

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPlay }: MovieCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-gray-900 border-gray-800 hover:scale-105 transition-transform duration-300 cursor-pointer">
      <div className="aspect-[3/4] relative">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Episode/Season badge */}
        {movie.episode && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
            {movie.episode}
          </div>
        )}
        
        {/* Status badge */}
        {movie.status && (
          <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded font-semibold ${
            movie.status === "Đang phát hành" ? "bg-green-500" : "bg-blue-500"
          }`}>
            {movie.status}
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {movie.title}
          </h3>
          
          {movie.season && (
            <p className="text-gray-300 text-xs mb-1">{movie.season}</p>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-xs">★ {movie.rating}</span>
            <span className="text-gray-300 text-xs">{movie.year}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-gray-700/80 text-gray-300 px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <Button
            size="sm"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            onClick={() => onPlay?.(movie)}
          >
            ▶ Xem Ngay
          </Button>
        </div>
        
        {/* Bottom info always visible */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {movie.title}
          </h3>
          {movie.episode && (
            <p className="text-orange-400 text-xs">{movie.episode}</p>
          )}
        </div>
      </div>
    </Card>
  );
}