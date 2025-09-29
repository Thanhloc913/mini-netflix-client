import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";
import { Play, Plus } from "lucide-react";

interface HeroSectionProps {
  movies: Movie[];
  onPlay?: (movie: Movie) => void;
}

export function HeroSection({ movies, onPlay }: HeroSectionProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = movies[currentIndex];

  const handleWatchNow = () => {
    if (currentMovie?.id) {
      navigate(`/watch/${currentMovie.id}`);
    }
  };

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!currentMovie) return null;

  return (
    <div className="relative h-[100vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${currentMovie.posterUrl ||
            "https://via.placeholder.com/1920x1080?text=No+Image"
            })`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-full">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
                {currentMovie.title}
              </h1>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMovie.genres &&
                currentMovie.genres.slice(0, 4).map((genre: any, index: number) => (
                  <span key={index} className="text-gray-300 text-sm">
                    {genre.name || genre}
                    {index < currentMovie.genres.length - 1 && index < 3 ? ", " : ""}
                  </span>
                ))}
            </div>

            {/* Description */}
            <p className="text-gray-200 text-base md:text-lg mb-8 line-clamp-4 leading-relaxed max-w-xl">
              {currentMovie.description}
            </p>

            {/* Actions + Indicators */}
            <div className="flex flex-col gap-4">
              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-base font-semibold flex items-center gap-2 rounded-md"
                  onClick={handleWatchNow}
                >
                  <Play className="h-5 w-5 fill-current" />
                  Xem ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-400 text-white hover:bg-white hover:text-black px-4 py-3 text-base font-semibold rounded-md"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {movies.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                      ? "bg-red-500 w-8"
                      : "bg-white/40 w-2 hover:bg-white/60"
                      }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:flex flex-1 justify-end items-center h-full">
            <div className="w-full h-full relative">{/* optional overlay */}</div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-colors z-30"
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
        }
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-colors z-30"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
