// src/components/layout/Navbar.tsx
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandExplore, setExpandExplore] = useState(true);
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
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white">Search</Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  "Action","Adult Cast","Adventure","Comedy","Drama",
                  "Fantasy","Gore","Harem","Horror","Isekai",
                  "Romance","Supernatural","School","Video Game","Time Travel",
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