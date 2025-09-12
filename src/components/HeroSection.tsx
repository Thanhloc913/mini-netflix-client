import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";
import { Play, Plus, Calendar, Clock, Star } from "lucide-react";

interface HeroSectionProps {
  movies: Movie[];
  onPlay?: (movie: Movie) => void;
}

export function HeroSection({ movies, onPlay }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!currentMovie) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${currentMovie.posterUrl || "https://via.placeholder.com/1920x1080?text=No+Image"})` 
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-8 md:px-16">
        <div className="max-w-4xl">
          {/* Type and Genre tags */}
          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              currentMovie.isSeries ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
            }`}>
              {currentMovie.isSeries ? "Phim bộ" : "Phim lẻ"}
            </span>
            {currentMovie.genres && currentMovie.genres.slice(0, 2).map((genre: any, index: number) => (
              <span
                key={index}
                className="bg-gray-700/80 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {genre.name || genre}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {currentMovie.title}
          </h1>
          
          {/* Movie info */}
          <div className="flex items-center gap-6 mb-6 text-lg">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">{currentMovie.rating}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(currentMovie.releaseDate)}</span>
            </div>
            {currentMovie.duration && (
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-5 w-5" />
                <span>{formatDuration(currentMovie.duration)}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-200 text-lg mb-8 line-clamp-3 leading-relaxed max-w-3xl">
            {currentMovie.description}
          </p>
          
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-3"
              onClick={() => onPlay?.(currentMovie)}
            >
              <Play className="h-6 w-6 fill-current" />
              Xem ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-6 py-3 text-lg font-semibold flex items-center gap-3"
            >
              <Plus className="h-6 w-6" />
              Danh sách của tôi
            </Button>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-20"
        onClick={() => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)}
      >
        ←
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-20"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)}
      >
        →
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-orange-500 w-8" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}