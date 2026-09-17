"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { useRegisterMutation } from '@/queries/auth.queries';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    registerMutation.mutate(
      { email, username: username || email.split('@')[0], password, name },
      {
        onSuccess: () => {
          toast.success('Đăng ký tài khoản thành công! Chào mừng bạn đến với EduShort 🎉');
          router.push('/');
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err.message || 'Đăng ký không thành công';
          setError(errMsg);
          toast.error(errMsg);
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900">
      <TopNav />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-5 pt-20">
        <div className="w-full max-w-sm p-8 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-pink-500/30">
              <UserPlus className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Đăng ký tài khoản
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Trở thành học viên EduShort ngay hôm nay!
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 text-xs font-bold text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Họ và Tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium"
                />
                <UserIcon className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  minLength={3}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="vietduc2003"
                  className="w-full pl-10 pr-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium"
                />
                <UserIcon className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="edu@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium"
                />
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mật khẩu (tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium"
                />
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-500 font-medium">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-purple-600 font-extrabold underline hover:text-purple-800"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
