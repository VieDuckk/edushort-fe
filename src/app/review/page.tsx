"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { useAuthStore } from "@/state/auth";
import { useReviewListQuery } from "@/queries/quiz.queries";
import { ReviewCardSkeleton } from "@/components/Skeleton";
import { BookOpen, Play, CheckCircle2, LogIn } from "lucide-react";

interface ReviewItem {
  id: number;
  createdAt: string;
  question: {
    id: number;
    content: string;
    category?: { name: string };
    options: {
      id: number;
      label: string;
      content: string;
      isCorrect: boolean;
    }[];
  };
  selectedOption: {
    id: number;
    label: string;
    content: string;
  };
  videoToReview?: {
    id: number;
    title: string;
    description?: string;
    videoUrl?: string;
    videoKey?: string;
    thumbnailUrl?: string;
    thumbnailKey?: string;
    category?: { name: string };
  };
}

export default function ReviewPage() {
  const user = useAuthStore((state) => state.state.user);
  const ready = useAuthStore((state) => state.state.ready);
  const { data: items = [], isLoading } = useReviewListQuery();
  const [activeVideo, setActiveVideo] = useState<
    ReviewItem["videoToReview"] | null
  >(null);

  return (
    <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900 flex flex-col">
      <TopNav />

      <div className="flex-1 overflow-y-auto page-scroll mt-12 sm:mt-14 pb-8">
        <div className="max-w-md sm:max-w-2xl mx-auto py-4 sm:py-6 px-3.5 sm:px-5">
          {/* Header */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Góc Ôn Tập Kiến Thức
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Danh sách các câu hỏi bạn trả lời chưa đúng & video bài học cần xem lại
              </p>
            </div>
          </div>

        {/* Not Logged In */}
        {!user && ready && (
          <div className="p-8 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl text-center shadow-xl shadow-purple-500/10">
            <LogIn className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Vui lòng đăng nhập
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mb-5">
              Bạn cần đăng nhập để lưu vết các câu hỏi làm sai và xem lại video
              hoạt hình tương ứng.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {/* Logged in state */}
        {user && (
          <div>
            {isLoading ? (
              <div className="space-y-4">
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl text-center shadow-xl shadow-purple-500/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Tuyệt vời! Không có câu hỏi nào cần ôn lại.
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-5">
                  Hãy tiếp tục lướt video để thử thách bản thân với các câu hỏi
                  mới!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all"
                >
                  Quay lại Lướt Video
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item: any) => {
                  const correctOpt = item.question?.options?.find(
                    (o: any) => o.isCorrect,
                  );
                  const thumb =
                    item.videoToReview?.thumbnailUrl ||
                    item.videoToReview?.thumbnailKey;
                  const videoUrl =
                    item.videoToReview?.videoUrl ||
                    item.videoToReview?.videoKey;

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl hover:border-purple-300 transition-all shadow-lg shadow-purple-500/5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
                          {item.question?.category?.name || "Tổng hợp"}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-800 mb-3 leading-relaxed">
                        ❓ {item.question?.content}
                      </h3>

                      <div className="text-xs mb-4 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 space-y-1.5 font-medium">
                        <div className="text-rose-600">
                          ❌ Lựa chọn của bạn:{" "}
                          <strong>
                            {item.selectedOption?.label}.{" "}
                            {item.selectedOption?.content}
                          </strong>
                        </div>
                        {correctOpt && (
                          <div className="text-emerald-600">
                            ✅ Đáp án đúng:{" "}
                            <strong>
                              {correctOpt.label}. {correctOpt.content}
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* Video recommendation */}
                      {item.videoToReview && (
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-100 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 relative shadow-sm">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={item.videoToReview.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                  <Play className="w-4 h-4 fill-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                                {item.videoToReview.title}
                              </div>
                              <div className="text-[11px] font-semibold text-purple-600">
                                Video bài học sinh động
                              </div>
                            </div>
                          </div>

                          <button
                            className="px-3.5 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 shrink-0 shadow-md shadow-pink-500/20 hover:opacity-95"
                            onClick={() => setActiveVideo(item.videoToReview)}
                          >
                            <Play className="w-3.5 h-3.5 fill-white" /> Xem ngay
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-5 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-md p-4 rounded-3xl bg-white border border-purple-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 truncate pr-4">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-extrabold"
              >
                ✕
              </button>
            </div>
            <video
              src={activeVideo.videoUrl || activeVideo.videoKey}
              controls
              autoPlay
              className="w-full rounded-2xl max-h-[70vh] bg-black shadow-md"
            />
          </div>
        </div>
      )}
    </main>
  );
}
