'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2, Camera, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '@/api/user/user.api';

const R2_PUBLIC_URL = 'https://pub-e0b7abd390d54cafb8cd86056d16848a.r2.dev';

interface AvatarUploadBoxProps {
  value: string;
  onChange: (url: string) => void;
  defaultAvatars?: string[];
}

const DEFAULT_PRESET_AVATARS: string[] = [];

export const AvatarUploadBox: React.FC<AvatarUploadBoxProps> = ({
  value,
  onChange,
  defaultAvatars = DEFAULT_PRESET_AVATARS,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    setIsProcessing(true);
    try {
      // Bước 1: Lấy presigned URL từ backend
      const { url: uploadUrl, key } = await userApi.getAvatarUploadUrl(file.name, file.type);

      // Bước 2: Upload file trực tiếp lên Cloudflare R2
      await userApi.uploadAvatarToStorage(uploadUrl, file);

      // Bước 3: Tạo public URL từ key
      const publicUrl = `${R2_PUBLIC_URL}/${key}`;
      onChange(publicUrl);
      toast.success('Đã tải ảnh avatar lên thành công!');
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast.error(err?.response?.data?.message || 'Đã xảy ra lỗi khi tải ảnh lên.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          Ảnh đại diện (Avatar)
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Chế độ Upload tệp' : 'Nhập URL ảnh trực tiếp'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-2 animate-fade-in">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/my-avatar.jpg"
            className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium"
          />
        </div>
      ) : (
        /* Slaunch Style Image Upload Box */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer overflow-hidden ${
            isDragging
              ? 'border-purple-500 bg-purple-100/60 scale-[1.01] shadow-xl shadow-purple-500/10'
              : value
              ? 'border-purple-200 bg-purple-50/20 hover:border-purple-400 hover:bg-purple-50/50'
              : 'border-purple-200/80 bg-purple-50/30 hover:border-purple-400 hover:bg-purple-50/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {value ? (
            /* Live Image Preview State */
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-lg shadow-pink-500/25">
                  <img
                    src={value}
                    alt="Avatar preview"
                    className="w-full h-full object-cover rounded-[14px] bg-white"
                  />
                </div>
                <div className="absolute inset-0 bg-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-2">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Đã tải ảnh lên
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  Nhấp vào đây hoặc kéo thả ảnh mới để thay đổi Avatar của bạn.
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm hover:bg-purple-700 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                      toast.info('Đã xóa avatar');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs flex items-center gap-1 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Dropzone Empty State */
            <div className="py-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto shadow-inner">
                {isProcessing ? (
                  <RefreshCw className="w-7 h-7 animate-spin text-purple-600" />
                ) : (
                  <UploadCloud className="w-7 h-7 text-purple-600" />
                )}
              </div>

              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {isDragging
                    ? 'Thả ảnh vào đây ngay!'
                    : 'Kéo & thả ảnh vào đây, hoặc '}
                  <span className="text-purple-600 underline">bấm để chọn tệp</span>
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preset Suggestions — only shown if presets exist */}
      {defaultAvatars.length > 0 && (
        <div className="pt-1">
          <label className="block text-[11px] font-extrabold text-slate-500 mb-2 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-purple-500" /> Gợi ý mẫu Avatar nhanh:
          </label>
          <div className="flex gap-2.5">
            {defaultAvatars.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(url)}
                className={`w-11 h-11 rounded-2xl overflow-hidden border-2 transition-all ${
                  value === url
                    ? 'border-purple-600 scale-110 shadow-md shadow-purple-500/20'
                    : 'border-purple-100 hover:border-purple-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
