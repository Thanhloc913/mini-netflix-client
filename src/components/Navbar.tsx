import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import type { Movie } from "@/mock/movies";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandExplore, setExpandExplore] = useState(true);
  const { user, logout, isAdmin } = useAuth();

  const handleMoviePlay = (movie: Movie) => {
    console.log("Playing movie:", movie.title);
    alert(`Đang phát: ${movie.title}`);
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,.4)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-neutral-100 sm:px-6 lg:px-8">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-6">
          {/* Mobile menu toggle (next to logo) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-neutral-300 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-xl font-bold tracking-wide md:text-2xl">
            My<span className="text-red-600">Netflix</span>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden items-center gap-6 md:flex list-none">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent px-0 text-sm font-medium text-neutral-300 hover:text-white focus-visible:ring-2 focus-visible:ring-red-600/60 data-[state=open]:text-white">
                Browse
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:w-[980px]">
                <div className="grid gap-8 rounded-lg border border-white/10 bg-neutral-900 p-6 text-sm text-neutral-300 shadow-xl md:grid-cols-4">
                  <div className="col-span-1 pr-6 md:border-r md:border-white/10">
                    <div className="flex flex-col gap-4">
                      <a href="#" className="block hover:text-white">Popular</a>
                      <a href="#" className="block hover:text-white">New</a>
                      <a href="#" className="block hover:text-white">Alphabetical</a>
                      <a href="#" className="block hover:text-white">Simulcast Season</a>
                      <a href="#" className="block hover:text-white">Movies</a>
                      <a href="#" className="block hover:text-white">Studio</a>
                    </div>
                  </div>
                  <div className="col-span-3 grid grid-cols-3 gap-8">
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Explore</div>
                      <div className="flex flex-col gap-3">
                        <a href="#" className="hover:text-white">Action</a>
                        <a href="#" className="hover:text-white">Adult Cast</a>
                        <a href="#" className="hover:text-white">Adventure</a>
                        <a href="#" className="hover:text-white">Comedy</a>
                        <a href="#" className="hover:text-white">Drama</a>
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">&nbsp;</div>
                      <div className="flex flex-col gap-3">
                        <a href="#" className="hover:text-white">Fantasy</a>
                        <a href="#" className="hover:text-white">Gore</a>
                        <a href="#" className="hover:text-white">Harem</a>
                        <a href="#" className="hover:text-white">Horror</a>
                        <a href="#" className="hover:text-white">Isekai</a>
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">&nbsp;</div>
                      <div className="flex flex-col gap-3">
                        <a href="#" className="hover:text-white">Romance</a>
                        <a href="#" className="hover:text-white">Supernatural</a>
                        <a href="#" className="hover:text-white">School</a>
                        <a href="#" className="hover:text-white">Video Game</a>
                        <a href="#" className="hover:text-white">Time Travel</a>
                      </div>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="text-sm text-neutral-300 transition-colors hover:text-white">Games</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="text-sm text-neutral-300 transition-colors hover:text-white">More</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>

        {/* Right side: Search / Avatar */}
        <div className="flex items-center gap-3">
          <SearchBar onMoviePlay={handleMoviePlay} />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-white/10 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600/50">
                  <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                    {user.profile.avatarUrl ? (
                      <img
                        src={user.profile.avatarUrl}
                        alt={user.profile.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Fallback nếu avatar không load được
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className={`${user.profile.avatarUrl ? 'hidden' : 'flex'} items-center justify-center h-full w-full`}>
                      {user.profile.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden md:inline text-sm text-neutral-300">
                    {user.profile.name || "User"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-neutral-900 rounded-xl shadow-xl overflow-hidden dropdown-content"
                sideOffset={5}
                avoidCollisions={true}
                collisionPadding={16}
                side="bottom"
              >
                <div className="px-3 py-2 border-b border-neutral-700">
                  <p className="text-sm font-medium text-white">{user.profile.name}</p>
                  <p className="text-xs text-neutral-400">{user.account.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <DropdownMenuItem asChild className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                  <Link to="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-neutral-700" />
                    <DropdownMenuItem className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                      <Settings className="h-4 w-4 mr-2" />
                      Quản trị
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="bg-neutral-700" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="h-8 px-3 text-sm bg-red-600 hover:bg-red-700 text-white"
                >
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer (left) */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* drawer */}
          <div className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-neutral-900 p-4 text-sm text-neutral-200 shadow-xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Browse</div>
            <div className="mb-5 flex flex-col gap-2">
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">Popular</a>
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">New</a>
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">Alphabetical</a>
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">Simulcast Season</a>
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">Movies</a>
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">Studio</a>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-neutral-200 hover:bg-white/5"
              onClick={() => setExpandExplore((v) => !v)}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Explore</span>
              <span className="text-neutral-400">{expandExplore ? "▾" : "▸"}</span>
            </button>
            {expandExplore && (
              <div className="mt-2 grid grid-cols-2 gap-2 px-2">
                {[
                  "Action", "Adult Cast", "Adventure", "Comedy", "Drama",
                  "Fantasy", "Gore", "Harem", "Horror", "Isekai",
                  "Romance", "Supernatural", "School", "Video Game", "Time Travel",
                ].map((g) => (
                  <a key={g} href="#" className="rounded px-2 py-1 hover:bg-white/5">{g}</a>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4">
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">Games</a>
              <a href="#" className="rounded px-2 py-2 hover:bg-white/5">More</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}