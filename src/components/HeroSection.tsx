import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/mock/movies";

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

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentMovie.backdropUrl})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-8 md:px-16">
        <div className="max-w-3xl">
          {/* Genre tags */}
          <div className="flex gap-2 mb-4">
            {currentMovie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="bg-orange-600/80 text-white px-3 py-1 rounded text-sm font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            {currentMovie.title}
          </h1>
          
          {/* Episode and season info */}
          <div className="flex items-center gap-4 mb-4">
            {currentMovie.season && (
              <span className="text-orange-400 text-lg font-semibold">{currentMovie.season}</span>
            )}
            {currentMovie.episode && (
              <span className="text-white text-lg">{currentMovie.episode}</span>
            )}
            <span className="text-yellow-400 text-lg">★ {currentMovie.rating}</span>
            <span className="text-gray-300">{currentMovie.year}</span>
          </div>
          
          {/* Status */}
          {currentMovie.status && (
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                currentMovie.status === "Đang phát hành" 
                  ? "bg-green-600 text-white" 
                  : "bg-blue-600 text-white"
              }`}>
                {currentMovie.status}
              </span>
            </div>
          )}
          
          <p className="text-gray-200 text-lg mb-8 line-clamp-3 leading-relaxed">
            {currentMovie.description}
          </p>
          
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
              onClick={() => onPlay?.(currentMovie)}
            >
              ▶ START WATCHING E1
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-6 py-3 text-lg font-semibold"
            >
              📋 Thêm vào danh sách
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