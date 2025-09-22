import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";
import { Play, Calendar, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPlay }: MovieCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isTransitioning) return; // Prevent spam clicks
    
    setIsTransitioning(true);
    
    // Get card position and set it as fixed position
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      
      // Set fixed position to current location
      cardRef.current.style.position = 'fixed';
      cardRef.current.style.top = `${rect.top}px`;
      cardRef.current.style.left = `${rect.left}px`;
      cardRef.current.style.width = `${rect.width}px`;
      cardRef.current.style.height = `${rect.height}px`;
      cardRef.current.style.zIndex = '99999';
      
      // Add expanding animation class
      setTimeout(() => {
        cardRef.current?.classList.add('movie-card-expanding');
      }, 10);
    }
    
    // Navigate after animation
    setTimeout(() => {
      navigate(`/movie/${movie.id}`);
    }, 800);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(movie);
  };

  return (
    <>
      <Card 
        ref={cardRef}
        onClick={handleCardClick}
        className={`group relative overflow-hidden bg-gray-900 border-gray-800 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl ${
          isTransitioning ? 'z-50' : ''
        }`}
      >
      <div className="aspect-[2/3] relative">
        {/* Poster Image */}
        <img
          src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        
        {/* Type badge */}
        <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-semibold ${
          movie.isSeries ? "bg-blue-600" : "bg-purple-600"
        }`}>
          {movie.isSeries ? "Phim bộ" : "Phim lẻ"}
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
          <Star className="h-3 w-3 fill-current" />
          {movie.rating}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-bold text-base mb-2 line-clamp-2 leading-tight">
            {movie.title}
          </h3>
          
          <p className="text-gray-300 text-xs mb-3 line-clamp-3 leading-relaxed">
            {movie.description}
          </p>
          
          {/* Movie info */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(movie.releaseDate)}
            </div>
            {movie.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(movie.duration)}
              </div>
            )}
          </div>
          
          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genres.slice(0, 2).map((genre: any, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-700/80 text-gray-300 px-2 py-1 rounded-full"
                >
                  {genre.name || genre}
                </span>
              ))}
            </div>
          )}
          
          {/* Play button */}
          <Button
            size="sm"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 transition-colors"
            onClick={handlePlayClick}
          >
            <Play className="h-4 w-4 fill-current" />
            Xem ngay
          </Button>
        </div>
        
        {/* Bottom info always visible */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span>{formatDate(movie.releaseDate)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {movie.rating}
            </span>
          </div>
        </div>
      </div>
      </Card>
      
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/80 z-50 animate-fade-in" />
      )}
    </>
  );
}