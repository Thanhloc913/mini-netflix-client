import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMovieSearch } from "@/hooks/useMovies";
import { useDebounce } from "@/hooks/useDebounce";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types/movie";

interface SearchBarProps {
  onMoviePlay?: (movie: Movie) => void;
}

export function SearchBar({ onMoviePlay }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500);
  const { data: searchResponse, isLoading: loading } = useMovieSearch(debouncedQuery);
  const results = searchResponse?.movies || [];

  // Focus input khi expand
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Click outside để đóng
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setQuery("");
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // ESC để đóng
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsExpanded(false);
        setQuery("");
      }
    }

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setQuery("");
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-all duration-200"
        onClick={handleExpand}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Tìm kiếm</span>
      </Button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Search container */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50 px-4 max-h-[calc(100vh-6rem)]">
        <div className="bg-neutral-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-700/50 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center p-4 border-b border-neutral-700/50">
            <Search className="h-5 w-5 text-neutral-400 mr-3" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm anime, phim..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white placeholder-neutral-400 focus:ring-0 focus:outline-none text-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="ml-2 h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search results */}
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-neutral-400">Đang tìm kiếm...</span>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Không tìm thấy kết quả cho "{query}"</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="p-4">
                <p className="text-sm text-neutral-400 mb-4">
                  Tìm thấy {searchResponse?.total || results.length} kết quả
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.slice(0, 8).map((movie) => (
                    <div key={movie.id} className="w-full">
                      <MovieCard
                        movie={movie}
                        onPlay={(movie) => {
                          onMoviePlay?.(movie);
                          handleClose();
                        }}
                      />
                    </div>
                  ))}
                </div>
                {results.length > 8 && (
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                    >
                      Xem thêm {(searchResponse?.total || results.length) - 8} kết quả
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!query && (
              <div className="p-4 text-center text-neutral-400">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nhập từ khóa để tìm kiếm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}