'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { AvatarUploadBox } from '@/components/AvatarUploadBox';
import { useAuthStore } from '@/state/auth';
import { useUpdateUserMutation } from '@/queries/user.queries';
import { useReviewListQuery } from '@/queries/quiz.queries';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  BookOpen,
  CheckCircle2,
  Save,
  LogOut,
  Sparkles,
  Camera,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLogout } from '@/queries/auth.queries';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.state.user);
  const ready = useAuthStore((state) => state.state.ready);
  const setAuthState = useAuthStore((state) => state.setState);
  const logout = useLogout();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const updateUserMutation = useUpdateUserMutation();
  const { data: reviewItems = [] } = useReviewListQuery({ enabled: Boolean(user) });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast.error('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setSuccessMessage('');
    setErrorMessage('');

    updateUserMutation.mutate(
      {
        id: user.id,
        data: {
          name,
          avatarUrl: avatarUrl || undefined,
        },
      },
      {
        onSuccess: (updatedUser) => {
          const msg = 'Cập nhật thông tin tài khoản thành công!';
          setSuccessMessage(msg);
          toast.success(msg);
          setAuthState({
            user: {
              ...user,
              name: updatedUser.name ?? name,
              avatarUrl: updatedUser.avatarUrl ?? avatarUrl,
            },
          });
          setTimeout(() => setSuccessMessage(''), 4000);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err.message || 'Cập nhật tài khoản thất bại';
          setErrorMessage(errMsg);
          toast.error(errMsg);
        },
      },
    );
  };

  if (!ready) {
    return (
      <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900">
        <TopNav />
        <div className="h-full flex items-center justify-center">
          <p className="text-purple-600 font-bold text-sm">Đang tải thông tin tài khoản...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900">
        <TopNav />
        <div className="h-full flex items-center justify-center px-5">
          <div className="p-8 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl text-center shadow-xl shadow-purple-500/10 max-w-sm w-full">
            <UserIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Vui lòng đăng nhập</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mb-6">
              Bạn cần đăng nhập để xem và quản lý thông tin tài khoản cá nhân.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900 flex flex-col">
      <TopNav />

      <div className="flex-1 overflow-y-auto page-scroll mt-12 sm:mt-14 pb-8">
        <div className="max-w-md sm:max-w-2xl mx-auto py-4 sm:py-6 px-3.5 sm:px-5">
          {/* Profile Card Header */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-300/30 via-purple-300/30 to-indigo-300/30 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar container */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-lg shadow-pink-500/25">
                <div className="w-full h-full rounded-[14px] bg-slate-100 overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user.name || user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-purple-600">
                      {(user.name || user.username).substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* User Meta */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {user.name || user.username}
                </h1>
                <span className="text-xs font-extrabold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full">
                  @{user.username}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-purple-500" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  {user.role}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  Gia nhập: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Activity Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            href="/review"
            className="p-4 rounded-2xl bg-white/80 border border-purple-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500">Cần ôn tập</div>
              <div className="text-base font-black text-slate-900 flex items-center gap-1">
                {reviewItems.length} bài
                <ArrowRight className="w-3.5 h-3.5 text-pink-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <div className="p-4 rounded-2xl bg-white/80 border border-purple-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500">Tài khoản</div>
              <div className="text-base font-black text-purple-600">Đã xác thực ✅</div>
            </div>
          </div>
        </div>

        {/* OWNER Creator Studio Shortcut */}
        {user.role === 'OWNER' && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-pink-200 mb-1">
                Dành cho Quản trị viên
              </div>
              <h3 className="text-base font-extrabold">Creator Studio & Đăng Bài</h3>
              <p className="text-xs text-purple-100 mt-1">
                Tạo Video bài học mới, soạn câu hỏi Quiz và quản lý danh sách nội dung.
              </p>
            </div>
            <Link
              href="/creator"
              className="px-4 py-2.5 rounded-2xl bg-white text-purple-700 font-extrabold text-xs shadow-md hover:bg-purple-50 transition-all shrink-0"
            >
              Vào Studio &rarr;
            </Link>
          </div>
        )}

        {/* Edit Form */}
        <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10 mb-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-purple-600" />
            Chỉnh sửa thông tin cá nhân
          </h2>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-4 text-xs font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 text-xs font-bold text-rose-600">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tên hiển thị (Display Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold"
              />
            </div>

            <AvatarUploadBox value={avatarUrl} onChange={setAvatarUrl} />

            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {updateUserMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Logout action */}
        <div className="text-center">
          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs hover:bg-rose-100 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất tài khoản
          </button>
        </div>
      </div>
      </div>
    </main>
  );
}
