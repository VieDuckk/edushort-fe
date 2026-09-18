"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/state/auth";
import { BookOpen, Database } from "lucide-react";

interface AnimeHeaderBannerProps {
  watchedCount?: number;
}

export const AnimeHeaderBanner: React.FC<AnimeHeaderBannerProps> = ({
  watchedCount = 0,
}) => {
  const user = useAuthStore((state) => state.state.user);

  return (
    <header className="absolute top-0 left-0 right-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/40 select-none py-2 px-3.5 sm:px-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo + Green Role Pill */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-pink-300 font-extrabold text-lg sm:text-xl tracking-tight hover:opacity-90 transition-opacity drop-shadow-sm"
          >
            EduShort
          </Link>
          <span className="bg-emerald-400 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {user?.role === "OWNER" ? "QUẢN TRỊ" : "HỌC SINH"}
          </span>
        </div>

        {/* Right Side: Quiz Pill + Database Icon Button */}
        <div className="flex items-center gap-2">
          {/* Quiz Count Capsule Pill */}
          <Link
            href="/review"
            className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3 sm:px-3.5 py-1 rounded-full text-xs font-bold text-slate-200 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Xem góc ôn tập Quiz"
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>
              Quiz: <strong className="text-pink-300">{watchedCount}/5</strong>
            </span>
          </Link>

          {/* Database / Studio / Profile Icon Button */}
          <Link
            href={
              user?.role === "OWNER"
                ? "/creator"
                : user
                ? "/profile"
                : "/login"
            }
            title={
              user?.role === "OWNER"
                ? "Creator Studio (Quản lý)"
                : user
                ? "Tài khoản cá nhân"
                : "Đăng nhập"
            }
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-200 shadow-sm transition-all active:scale-95"
          >
            <Database className="w-4 h-4 text-slate-300" />
          </Link>
        </div>
      </div>
    </header>
  );
};
