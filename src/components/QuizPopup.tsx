'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  LogIn,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitQuizAnswerMutation } from '@/queries/quiz.queries';
import { useAuthStore } from '@/state/auth';

export interface QuizQuestionOption {
  id: number;
  label: string;
  content: string;
}

export interface QuizQuestion {
  id: number;
  content: string;
  category?: {
    id: number;
    name: string;
  };
  options: QuizQuestionOption[];
}

interface QuizPopupProps {
  question: QuizQuestion;
  watchedVideoIds: number[];
  onClose: () => void;
}

export const QuizPopup: React.FC<QuizPopupProps> = ({
  question,
  watchedVideoIds,
  onClose,
}) => {
  const user = useAuthStore((state) => state.state.user);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const submitAnswerMutation = useSubmitQuizAnswerMutation();
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctOptionId?: number;
    videoToReview?: {
      id: number;
      title: string;
      thumbnailUrl?: string;
      thumbnailKey?: string;
      videoUrl?: string;
      videoKey?: string;
      category?: { name: string };
    };
  } | null>(null);

  const handleSubmit = () => {
    if (!selectedOptionId || submitAnswerMutation.isPending) return;

    if (!user) {
      toast.warning('Vui lòng đăng nhập để thực hiện và lưu kết quả Quiz!');
      return;
    }

    submitAnswerMutation.mutate(
      {
        questionId: question.id,
        selectedOptionId,
        videoIds: watchedVideoIds,
      },
      {
        onSuccess: (res) => {
          setResult(res);
          if (res.isCorrect) {
            toast.success('Chính xác! Bạn nhận được điểm thưởng 🎉');
          } else {
            toast.info('Đã lưu bài học cần ôn tập 📌');
          }
        },
        onError: (err: any) => {
          toast.error(err.message || 'Lỗi khi gửi câu trả lời');
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-5 animate-fade-in">
      <div className="w-full max-w-[440px] p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-purple-100 shadow-2xl shadow-purple-500/20 relative animate-pop-up text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">
                Thử thách 5 Video {question.category ? `• ${question.category.name}` : ''}
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Kiểm tra kiến thức
              </h3>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 mb-5 text-sm font-bold text-slate-800 leading-relaxed shadow-inner">
          {question.content}
        </div>

        {/* Guest Warning */}
        {!user && !result && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 flex items-center justify-between gap-2 shadow-sm">
            <span className="font-semibold">Bạn cần đăng nhập để làm quiz & lưu tiến độ.</span>
            <Link
              href="/login"
              className="text-amber-900 font-extrabold underline flex items-center gap-1 hover:text-purple-600 transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" /> Đăng nhập
            </Link>
          </div>
        )}

        {/* Options List */}
        {!result ? (
          <div className="mb-6 space-y-2.5">
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`w-full p-3.5 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-all text-left ${
                    isSelected
                      ? 'border-2 border-purple-500 bg-gradient-to-r from-pink-50 to-purple-50 text-purple-950 shadow-md shadow-purple-500/10 translate-x-1'
                      : 'bg-purple-50/50 border border-purple-100 text-slate-700 hover:bg-purple-100/60 hover:border-purple-200'
                  }`}
                  onClick={() => setSelectedOptionId(opt.id)}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isSelected ? 'bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-sm' : 'bg-white border border-purple-200 text-slate-600'
                  }`}>
                    {opt.label}
                  </div>
                  <div className="flex-1 leading-snug">{opt.content}</div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Result Feedback */
          <div className="mb-6">
            {result.isCorrect ? (
              <div className="text-center p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-lg font-extrabold text-emerald-700 mb-1">
                  Chính xác! 🎉
                </h4>
                <p className="text-xs font-semibold text-emerald-600">
                  Bạn đã nắm vững lý thuyết từ các video vừa xem.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-600 mb-3">
                  <XCircle className="w-6 h-6 shrink-0" />
                  <span className="font-extrabold text-base">
                    Rất tiếc, trả lời chưa đúng!
                  </span>
                </div>

                {result.videoToReview && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Gợi ý video hoạt hình cần xem lại để củng cố:
                    </p>
                    <div className="flex gap-3 bg-white border border-purple-100 rounded-xl p-3 shadow-sm">
                      <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        {result.videoToReview.thumbnailUrl || result.videoToReview.thumbnailKey ? (
                          <img
                            src={result.videoToReview.thumbnailUrl || result.videoToReview.thumbnailKey}
                            alt={result.videoToReview.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-purple-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {result.videoToReview.title}
                        </span>
                        <span className="text-[11px] font-extrabold text-purple-600 mt-1">
                          Đã lưu vào danh sách Ôn tập 📌
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        {!result ? (
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
              onClick={onClose}
            >
              Bỏ qua
            </button>
            <button
              className={`flex-[2] py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all ${
                !selectedOptionId || submitAnswerMutation.isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-95 active:scale-98'
              }`}
              disabled={!selectedOptionId || submitAnswerMutation.isPending}
              onClick={handleSubmit}
            >
              {submitAnswerMutation.isPending ? 'Đang gửi...' : 'Gửi câu trả lời'}{' '}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all"
              onClick={onClose}
            >
              Tiếp tục lướt video <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
