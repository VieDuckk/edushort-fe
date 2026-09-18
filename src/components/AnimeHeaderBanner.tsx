"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/state/auth";
import { useLogout } from "@/queries/auth.queries";
import { LogOut, User as UserIcon } from "lucide-react";

export const AnimeHeaderBanner: React.FC = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.state.user);
  const logout = useLogout();

  return (
    <header className="absolute top-0 left-0 right-0 z-40 w-full overflow-hidden bg-slate-900/10 border-b border-pink-200/80 shadow-md select-none">
      {/* Background illustration overlay - bright & clear */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none"
        style={{ backgroundImage: `url('/images/header_banner.png')` }}
      />

      {/* Soft color tint wash for perfect legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-sky-200/50 via-purple-100/40 to-pink-200/50 backdrop-blur-[2px] pointer-events-none" />

      {/* Floating sparkles and clouds decoration */}
      <div className="absolute top-2 left-6 text-yellow-400 animate-pulse text-base pointer-events-none drop-shadow">
        ⭐
      </div>
      <div className="absolute top-2 right-12 text-pink-500 animate-bounce text-xs pointer-events-none drop-shadow">
        ✨
      </div>
      <div className="absolute bottom-2 left-16 text-purple-400 text-xs pointer-events-none drop-shadow">
        ☁️
      </div>

      {/* Top Navigation Menu Bar with Dividers | */}
      <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-between gap-1.5">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <div className="w-7 h-7 rounded-xl bg-linear-to-tr from-pink-500 via-rose-400 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-pink-500/30 group-hover:scale-110 transition-transform">
            ✨
          </div>
          <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tight hidden sm:inline drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            EduShort
          </span>
        </Link>

        {/* Center Navigation Menu inside glassmorphic capsule */}
        <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-extrabold text-slate-800 bg-white/70 backdrop-blur-md px-3 sm:px-4 py-1 rounded-full border border-white/80 shadow-sm mx-auto overflow-x-auto no-scrollbar max-w-[calc(100vw-130px)] sm:max-w-none">
          <Link
            href="/"
            className={`hover:text-pink-600 transition-colors whitespace-nowrap ${pathname === "/" ? "text-pink-600 font-black" : ""}`}
          >
            Trang Chủ
          </Link>
          <span className="text-purple-300 font-normal">|</span>

          <Link
            href="/review"
            className={`hover:text-pink-600 transition-colors whitespace-nowrap ${pathname === "/review" ? "text-pink-600 font-black" : ""}`}
          >
            Ôn Tập Quiz
          </Link>
          <span className="text-purple-300 font-normal">|</span>

          {user?.role === "OWNER" && (
            <>
              <Link
                href="/creator"
                className={`hover:text-pink-600 transition-colors whitespace-nowrap ${pathname === "/creator" ? "text-pink-600 font-black" : ""}`}
              >
                Creator Studio
              </Link>
              <span className="text-purple-300 font-normal">|</span>
            </>
          )}

          <Link
            href={user ? "/profile" : "/login"}
            className={`hover:text-pink-600 transition-colors whitespace-nowrap ${pathname === "/profile" ? "text-pink-600 font-black" : ""}`}
          >
            {user ? "Tài Khoản" : "Đăng Nhập"}
          </Link>
        </nav>

        {/* Top Right Orange/Peach CTA Button */}
        <div className="flex items-center gap-1 shrink-0">
          {user ? (
            <div className="flex items-center gap-1">
              <Link
                href="/profile"
                className="text-[11px] sm:text-xs font-black text-purple-800 bg-white/90 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full border border-purple-200 shadow-sm flex items-center gap-1 hover:bg-white transition-all max-w-[90px] sm:max-w-none truncate"
              >
                <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 shrink-0" />
                <span className="truncate">{user.name || user.username}</span>
              </Link>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors border border-purple-100 shadow-sm"
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/register"
              className="px-2.5 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 text-white font-black text-[11px] sm:text-xs shadow-md shadow-orange-400/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Đăng Ký
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
