"use client";

import React, { useState, useRef, useCallback } from "react";
import { TopNav } from "@/components/TopNav";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/Skeleton";
import { TVideo } from "@/@types/video.types";
import { QuizPopup, QuizQuestion } from "@/components/QuizPopup";
import { useVideosQuery } from "@/queries/video.queries";
import { quizApi } from "@/api/quiz/quiz.api";
import { Sparkles, ChevronUp, ChevronDown, RefreshCw, Play } from "lucide-react";

export default function HomeFeed() {
  const {
    data: videosRes,
    isLoading,
    isError,
    refetch,
  } = useVideosQuery({ page: 1, limit: 20, sort: 'random' });

  const videos: TVideo[] = Array.isArray(videosRes)
    ? videosRes
    : (videosRes as any)?.data || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [watchedVideoIds, setWatchedVideoIds] = useState<number[]>([]);
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    // Include end-of-feed slide (index === videos.length)
    if (index !== activeIndex && index >= 0 && index <= videos.length) {
      setActiveIndex(index);
    }
  }, [activeIndex, videos.length]);

  const goTo = useCallback(
    (direction: "up" | "down") => {
      if (!containerRef.current) return;
      const target =
        direction === "down"
          ? Math.min(activeIndex + 1, videos.length)
          : Math.max(activeIndex - 1, 0);
      containerRef.current.scrollTo({
        top: target * containerRef.current.clientHeight,
        behavior: "smooth",
      });
    },
    [activeIndex, videos.length]
  );

  const handleVideoViewed = useCallback(
    async (videoId: number) => {
      setWatchedVideoIds((prev) => {
        if (prev.includes(videoId)) return prev;
        const nextWatched = [...prev, videoId];

        if (nextWatched.length === 5) {
          quizApi
            .getRandomQuestion(nextWatched)
            .then((question) => setQuizQuestion(question))
            .catch(() => {});
          return [];
        }
        return nextWatched;
      });
    },
    []
  );

  const handleCloseQuiz = () => {
    setQuizQuestion(null);
    setWatchedVideoIds([]);
  };

  const isAtEnd = activeIndex === videos.length && videos.length > 0;

  return (
    <main className="relative w-full h-dvh bg-slate-950 overflow-hidden flex items-center justify-center select-none">
      {/* Ambient background glow for desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-950 to-black pointer-events-none hidden md:block" />

      {/* Navigation arrows — desktop side panel */}
      {!isLoading && !isError && videos.length > 0 && (
        <div className="hidden md:flex absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
          <button
            onClick={() => goTo("up")}
            disabled={activeIndex === 0}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-purple-600/80 transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none shadow-xl"
            aria-label="Video trước"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={() => goTo("down")}
            disabled={activeIndex >= videos.length}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-purple-600/80 transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none shadow-xl"
            aria-label="Video tiếp theo"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Centered Mobile Viewport Frame */}
      <div className="relative w-full md:max-w-[430px] h-dvh bg-black md:shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(168,85,247,0.2)] md:border-x md:border-purple-900/40 overflow-hidden flex flex-col">
        {/* TopNav — floats over video */}
        <TopNav watchedCount={watchedVideoIds.length} />

        {/* Quiz progress pill */}
        {!isAtEnd && (
          <div className="absolute top-[52px] sm:top-[58px] left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-2 text-[11px] sm:text-xs font-bold text-white shadow-xl transition-all animate-fade-in whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
            <span>
              Quiz:{" "}
              <strong className="text-purple-300">
                {watchedVideoIds.length}/5
              </strong>{" "}
              video
            </span>
            <div className="flex gap-1 ml-0.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    num <= watchedVideoIds.length
                      ? "bg-purple-400 shadow-sm shadow-purple-400/50 scale-110"
                      : "bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video scroll feed */}
        <div
          ref={containerRef}
          className="h-dvh w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
          onScroll={handleScroll}
        >
        {isLoading ? (
          <VideoCardSkeleton />
        ) : isError ? (
          <div className="h-dvh flex flex-col items-center justify-center text-rose-300 p-5 text-center gap-2 bg-black">
            <p className="font-bold text-base">Không thể kết nối đến Backend API</p>
            <p className="text-xs text-slate-400">
              Vui lòng kiểm tra backend server đang chạy ở http://localhost:3000
            </p>
          </div>
        ) : videos.length === 0 ? (
          <div className="h-dvh flex flex-col items-center justify-center text-slate-300 p-5 text-center gap-2 bg-black">
            <Play className="w-12 h-12 text-purple-400 opacity-60" />
            <p className="font-bold text-base">Chưa có video nào trong cơ sở dữ liệu</p>
          </div>
        ) : (
          <>
            {videos.map((video: TVideo, idx: number) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={idx === activeIndex}
                onView={handleVideoViewed}
              />
            ))}

            {/* End of feed card */}
            <div className="h-dvh w-full snap-start snap-always flex flex-col items-center justify-center bg-gradient-to-b from-black via-slate-950 to-slate-900 select-none">
              <div className="flex flex-col items-center gap-6 px-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-2xl shadow-purple-500/40">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    Bạn đã xem hết! 🎉
                  </h2>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
                    Đã hết video trong feed. Hãy quay lại sau để khám phá những bài học thú vị mới!
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!containerRef.current) return;
                    containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                    setActiveIndex(0);
                    if (videos.length > 0) {
                      setWatchedVideoIds([videos[0].id]);
                    } else {
                      setWatchedVideoIds([]);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-purple-500/30 hover:opacity-95 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Xem lại từ đầu
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      </div>

      {/* Quiz popup */}
      {quizQuestion && (
        <QuizPopup
          question={quizQuestion}
          watchedVideoIds={
            watchedVideoIds.length === 0
              ? videos.slice(0, 5).map((v: TVideo) => v.id)
              : watchedVideoIds
          }
          onClose={handleCloseQuiz}
        />
      )}
    </main>
  );
}
