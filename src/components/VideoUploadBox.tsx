'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Film,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  CheckCircle2,
  FileVideo,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoUploadBoxProps {
  label: string;
  accept: 'video/*' | 'image/*';
  value: File | null;
  previewUrl?: string;
  onChange: (file: File | null, objectUrl: string) => void;
  maxSizeMB?: number;
  required?: boolean;
  isUploading?: boolean;
  uploadProgress?: string;
}

export const VideoUploadBox: React.FC<VideoUploadBoxProps> = ({
  label,
  accept,
  value,
  previewUrl,
  onChange,
  maxSizeMB = accept === 'video/*' ? 500 : 10,
  required,
  isUploading,
  uploadProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isVideo = accept === 'video/*';

  const handleFile = (file: File) => {
    if (!file) return;

    const isValidType = isVideo
      ? file.type.startsWith('video/')
      : file.type.startsWith('image/');

    if (!isValidType) {
      toast.error(
        isVideo
          ? 'Vui lòng chọn tệp video (MP4, MOV, WEBM...)'
          : 'Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP...)'
      );
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      toast.error(`Kích thước tệp vượt quá ${maxSizeMB}MB. Vui lòng chọn tệp nhỏ hơn.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onChange(file, objectUrl);
    toast.success(`Đã chọn ${isVideo ? 'video' : 'ảnh'}: ${file.name}`);
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    onChange(null, '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info(`Đã xóa ${isVideo ? 'video' : 'ảnh'}`);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-extrabold text-slate-800">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !value && !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden ${
          isDragging
            ? 'border-purple-500 bg-purple-100/60 scale-[1.01] shadow-xl shadow-purple-500/10'
            : value
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-purple-200/80 bg-purple-50/30 hover:border-purple-400 hover:bg-purple-50/60 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {value && previewUrl ? (
          /* File selected — preview state */
          <div className="p-4 flex items-center gap-4">
            {/* Thumbnail / Video preview */}
            <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-purple-100 shadow-sm relative">
              {isVideo ? (
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-extrabold text-emerald-700 truncate">
                  {value.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-extrabold text-[11px]">
                  {isVideo ? 'VIDEO' : 'IMAGE'}
                </span>
                <span>{formatSize(value.size)}</span>
              </div>
              {isUploading && uploadProgress && (
                <div className="mt-1.5 text-xs font-bold text-purple-700 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>{uploadProgress}</span>
                </div>
              )}
            </div>

            {!isUploading && (
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center gap-1 hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Đổi
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs flex items-center gap-1 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty dropzone */
          <div className="py-8 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-200 flex items-center justify-center text-purple-500 mx-auto">
              {isDragging ? (
                <UploadCloud className="w-7 h-7 text-purple-600 animate-bounce" />
              ) : isVideo ? (
                <FileVideo className="w-7 h-7" />
              ) : (
                <ImageIcon className="w-7 h-7" />
              )}
            </div>

            <div>
              <p className="text-base font-extrabold text-slate-800">
                {isDragging ? 'Thả tệp vào đây!' : (
                  <>Kéo &amp; thả {isVideo ? 'video' : 'ảnh'}, hoặc <span className="text-purple-600 underline">bấm để chọn</span></>
                )}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {isVideo
                  ? `Hỗ trợ MP4, MOV, WEBM (Tối đa ${maxSizeMB}MB)`
                  : `Hỗ trợ PNG, JPG, WEBP (Tối đa ${maxSizeMB}MB)`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

