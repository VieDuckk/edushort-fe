'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { VideoUploadBox } from '@/components/VideoUploadBox';
import { useAuthStore } from '@/state/auth';
import { uploadFileToStorage } from '@/api/video/video.api';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/queries/category.queries';
import {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useVideosQuery,
} from '@/queries/video.queries';
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useQuestionsQuery,
} from '@/queries/question.queries';
import {
  PlusCircle,
  Video,
  HelpCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  List,
  Film,
  FolderOpen,
  ArrowLeft,
  Check,
  FolderPlus,
  Tag,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'upload-video' | 'create-quiz' | 'manage-videos' | 'manage-quizzes' | 'manage-categories';

export default function CreatorPage() {
  const user = useAuthStore((state) => state.state.user);
  const ready = useAuthStore((state) => state.state.ready);

  const [activeTab, setActiveTab] = useState<TabType>('upload-video');

  // Categories
  const { data: categories = [] } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  // Category management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [showQuickCategory, setShowQuickCategory] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.warning('Vui lòng nhập tên danh mục.');
      return;
    }
    const slug = newCategorySlug.trim() || newCategoryName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    createCategoryMutation.mutate(
      { name: newCategoryName.trim(), slug },
      {
        onSuccess: () => {
          toast.success(`Đã tạo danh mục "${newCategoryName.trim()}"!`);
          setNewCategoryName('');
          setNewCategorySlug('');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Tạo danh mục thất bại');
        },
      }
    );
  };

  const handleDeleteCategory = (id: number, name: string) => {
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => toast.success(`Đã xóa danh mục "${name}"`),
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Xóa danh mục thất bại'),
    });
  };

  const handleQuickCreateCategory = () => {
    if (!quickCatName.trim()) {
      toast.warning('Vui lòng nhập tên danh mục.');
      return;
    }
    const slug = quickCatName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    createCategoryMutation.mutate(
      { name: quickCatName.trim(), slug },
      {
        onSuccess: () => {
          toast.success(`Đã tạo danh mục "${quickCatName.trim()}"!`);
          setQuickCatName('');
          setShowQuickCategory(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Tạo danh mục thất bại');
        },
      }
    );
  };

  // --- Form 1: Create Video ---
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoCategoryId, setVideoCategoryId] = useState<number | ''>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState('');
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [externalVideoUrl, setExternalVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [videoSuccessMsg, setVideoSuccessMsg] = useState('');
  const [videoErrMsg, setVideoErrMsg] = useState('');

  const createVideoMutation = useCreateVideoMutation();

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSuccessMsg('');
    setVideoErrMsg('');

    if (!videoTitle.trim()) {
      const msg = 'Vui lòng nhập tiêu đề video.';
      setVideoErrMsg(msg);
      toast.warning(msg);
      return;
    }

    if (useUrlMode) {
      if (!externalVideoUrl.trim()) {
        const msg = 'Vui lòng nhập đường dẫn URL video (http://... hoặc https://...).';
        setVideoErrMsg(msg);
        toast.warning(msg);
        return;
      }
    } else {
      if (!videoFile) {
        const msg = 'Vui lòng chọn tệp video để tải lên.';
        setVideoErrMsg(msg);
        toast.warning(msg);
        return;
      }
    }

    let finalVideoKey = '';
    let finalThumbnailKey: string | undefined = undefined;

    try {
      setIsUploading(true);

      // 1. Upload video file to Cloudflare R2 if file mode selected
      if (!useUrlMode && videoFile) {
        setUploadStatus('Đang khởi tạo tải lên video...');
        finalVideoKey = await uploadFileToStorage(videoFile, 'video', (percent) => {
          setUploadStatus(`Đang tải video lên R2: ${percent}%`);
        });
      } else {
        finalVideoKey = externalVideoUrl.trim();
      }

      // 2. Upload thumbnail file to R2 if thumbnail file selected
      if (thumbnailFile) {
        setUploadStatus('Đang tải ảnh thumbnail...');
        finalThumbnailKey = await uploadFileToStorage(thumbnailFile, 'thumbnail');
      }

      setUploadStatus('Đang lưu thông tin bài học...');

      // 3. Create video entry in DB
      await createVideoMutation.mutateAsync({
        title: videoTitle.trim(),
        description: videoDesc.trim() || undefined,
        videoKey: finalVideoKey,
        thumbnailKey: finalThumbnailKey,
        categoryId: videoCategoryId ? Number(videoCategoryId) : undefined,
      });

      const msg = 'Đã đăng bài Video thành công!';
      setVideoSuccessMsg(msg);
      toast.success(msg);

      // Reset form
      setVideoTitle('');
      setVideoDesc('');
      setVideoFile(null);
      setVideoPreviewUrl('');
      setThumbnailFile(null);
      setThumbnailPreviewUrl('');
      setExternalVideoUrl('');
      setVideoCategoryId('');
      setTimeout(() => setVideoSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Create video error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Tải video thất bại. Vui lòng thử lại!';
      setVideoErrMsg(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  // --- Form 2: Create Question ---
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategoryId, setQuestionCategoryId] = useState<number | ''>('');
  const [options, setOptions] = useState([
    { label: 'A', content: '', isCorrect: true },
    { label: 'B', content: '', isCorrect: false },
    { label: 'C', content: '', isCorrect: false },
    { label: 'D', content: '', isCorrect: false },
  ]);
  const [questionSuccessMsg, setQuestionSuccessMsg] = useState('');
  const [questionErrMsg, setQuestionErrMsg] = useState('');

  const createQuestionMutation = useCreateQuestionMutation();

  const handleOptionContentChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index].content = val;
    setOptions(updated);
  };

  const handleSetCorrectOption = (correctIndex: number) => {
    setOptions(options.map((opt, i) => ({ ...opt, isCorrect: i === correctIndex })));
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionSuccessMsg('');
    setQuestionErrMsg('');

    if (!questionContent.trim()) {
      const msg = 'Vui lòng nhập nội dung câu hỏi.';
      setQuestionErrMsg(msg);
      toast.warning(msg);
      return;
    }
    if (!questionCategoryId) {
      const msg = 'Vui lòng chọn danh mục cho câu hỏi.';
      setQuestionErrMsg(msg);
      toast.warning(msg);
      return;
    }
    const emptyOption = options.find((opt) => !opt.content.trim());
    if (emptyOption) {
      const msg = `Vui lòng nhập nội dung cho lựa chọn ${emptyOption.label}.`;
      setQuestionErrMsg(msg);
      toast.warning(msg);
      return;
    }

    createQuestionMutation.mutate(
      {
        content: questionContent,
        categoryId: Number(questionCategoryId),
        options: options.map((opt) => ({
          label: opt.label,
          content: opt.content,
          isCorrect: opt.isCorrect,
        })),
      },
      {
        onSuccess: () => {
          const msg = 'Tạo câu hỏi Quiz thành công!';
          setQuestionSuccessMsg(msg);
          toast.success(msg);
          setQuestionContent('');
          setOptions([
            { label: 'A', content: '', isCorrect: true },
            { label: 'B', content: '', isCorrect: false },
            { label: 'C', content: '', isCorrect: false },
            { label: 'D', content: '', isCorrect: false },
          ]);
          setTimeout(() => setQuestionSuccessMsg(''), 4000);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || 'Tạo câu hỏi thất bại';
          setQuestionErrMsg(msg);
          toast.error(msg);
        },
      }
    );
  };

  // --- Manage List Data ---
  const { data: videosData } = useVideosQuery({ limit: 50 });
  const rawVideos = Array.isArray(videosData) ? videosData : videosData?.data || [];
  const { data: questionsData = [] } = useQuestionsQuery();

  const deleteVideoMutation = useDeleteVideoMutation();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const handleDeleteVideo = (id: number) => {
    deleteVideoMutation.mutate(id, {
      onSuccess: () => toast.success('Đã xóa video thành công'),
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Xóa video thất bại'),
    });
  };

  const handleDeleteQuestion = (id: number) => {
    deleteQuestionMutation.mutate(id, {
      onSuccess: () => toast.success('Đã xóa câu hỏi Quiz thành công'),
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Xóa câu hỏi thất bại'),
    });
  };

  // Category dropdown with quick-create inline widget
  const CategorySelect = ({
    value,
    onChange,
    required,
  }: {
    value: number | '';
    onChange: (v: number | '') => void;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          className="flex-1 px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium"
          required={required}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowQuickCategory(!showQuickCategory)}
          className={`flex items-center gap-1 px-3 py-3 rounded-2xl border text-xs font-extrabold transition-all whitespace-nowrap ${
            showQuickCategory
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
          }`}
          title="Tạo danh mục mới nhanh"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tạo mới</span>
        </button>
      </div>

      {showQuickCategory && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-2xl animate-slide-up">
          <Tag className="w-4 h-4 text-purple-500 shrink-0" />
          <input
            type="text"
            value={quickCatName}
            onChange={(e) => setQuickCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickCreateCategory())}
            placeholder="Tên danh mục mới..."
            className="flex-1 bg-transparent border-0 text-sm text-slate-800 focus:outline-none font-semibold"
            autoFocus
          />
          <button
            type="button"
            onClick={handleQuickCreateCategory}
            disabled={createCategoryMutation.isPending}
            className="p-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setShowQuickCategory(false); setQuickCatName(''); }}
            className="p-1.5 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  if (!ready) {
    return (
      <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900">
        <TopNav />
        <div className="h-full flex items-center justify-center">
          <p className="text-purple-600 font-bold text-sm">Đang tải Studio...</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== 'OWNER') {
    return (
      <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900">
        <TopNav />
        <div className="h-full flex items-center justify-center px-5">
          <div className="p-8 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl text-center shadow-xl shadow-purple-500/10 max-w-sm w-full">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Không có quyền truy cập</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mb-6">
              Trang Creator Studio chỉ dành cho tài khoản có quyền Quản trị (OWNER).
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Trở về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 text-slate-900 flex flex-col">
      <TopNav />

      {/* Scrollable content area below TopNav */}
      <div className="flex-1 overflow-y-auto page-scroll mt-14">
        <div className="max-w-[720px] mx-auto py-6 px-5">
          {/* Header Badge */}
          <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10 mb-6 relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-extrabold mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Creator Studio (Admin)
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Quản Lý &amp; Đăng Bài Nội Dung
              </h1>
            </div>
            <Link
              href="/profile"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-purple-600 bg-white border border-purple-100 px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
            >
              Trang cá nhân
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-white/80 border border-purple-100 backdrop-blur-md shadow-sm mb-6 overflow-x-auto no-scrollbar">
            {([
              { key: 'upload-video', label: 'Đăng Video', Icon: Video },
              { key: 'create-quiz', label: 'Tạo Quiz', Icon: HelpCircle },
              { key: 'manage-videos', label: `Video (${rawVideos.length})`, Icon: Film },
              { key: 'manage-quizzes', label: `Quiz (${questionsData.length})`, Icon: List },
              { key: 'manage-categories', label: `Danh Mục (${categories.length})`, Icon: FolderPlus },
            ] as { key: TabType; label: string; Icon: React.ElementType }[]).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* TAB 1: Upload Video Form */}
          {activeTab === 'upload-video' && (
            <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Video className="w-6 h-6 text-pink-500" />
                Đăng tải Video Bài Học Mới
              </h2>

              {videoSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 text-sm font-extrabold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  {videoSuccessMsg}
                </div>
              )}
              {videoErrMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-4 text-sm font-extrabold text-rose-600 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  {videoErrMsg}
                </div>
              )}

              <form onSubmit={handleCreateVideo} className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                    Tiêu đề Video <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="VD: Định luật Vạn Vật Hấp Dẫn của Newton 🍎"
                    className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-base focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                    Mô tả bài học
                  </label>
                  <textarea
                    value={videoDesc}
                    onChange={(e) => setVideoDesc(e.target.value)}
                    placeholder="Tóm tắt ngắn gọn nội dung kiến thức trong video..."
                    rows={3}
                    className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-base focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                    Danh mục bài học
                  </label>
                  <CategorySelect value={videoCategoryId} onChange={setVideoCategoryId} />
                </div>

                {/* Source Selection Toggle: File vs URL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-extrabold text-slate-800">
                      Nguồn Video <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-1 bg-purple-50 p-1 rounded-xl border border-purple-100">
                      <button
                        type="button"
                        onClick={() => setUseUrlMode(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          !useUrlMode
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-purple-600'
                        }`}
                      >
                        📁 Tải tệp từ máy
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseUrlMode(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          useUrlMode
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-purple-600'
                        }`}
                      >
                        🔗 Dán URL trực tiếp
                      </button>
                    </div>
                  </div>

                  {!useUrlMode ? (
                    <VideoUploadBox
                      label=""
                      accept="video/*"
                      value={videoFile}
                      previewUrl={videoPreviewUrl}
                      onChange={(file, url) => { setVideoFile(file); setVideoPreviewUrl(url); }}
                      isUploading={isUploading}
                      uploadProgress={uploadStatus}
                      required
                    />
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={externalVideoUrl}
                        onChange={(e) => setExternalVideoUrl(e.target.value)}
                        placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                        className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-base focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-mono"
                        required
                      />
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        Dán đường dẫn URL kết thúc bằng .mp4, .webm hoặc từ CDN ngoài.
                      </p>
                    </div>
                  )}
                </div>

                {/* Thumbnail upload box */}
                <VideoUploadBox
                  label="Ảnh Thumbnail (xem trước)"
                  accept="image/*"
                  value={thumbnailFile}
                  previewUrl={thumbnailPreviewUrl}
                  onChange={(file, url) => { setThumbnailFile(file); setThumbnailPreviewUrl(url); }}
                  isUploading={isUploading}
                />

                {isUploading && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl animate-pulse">
                    <p className="text-xs font-bold text-purple-700 text-center">
                      ⚡ {uploadStatus || 'Đang xử lý tải lên...'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading || createVideoMutation.isPending}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  {isUploading ? (uploadStatus || 'Đang tải lên Cloudflare R2...') : createVideoMutation.isPending ? 'Đang xuất bản...' : 'Đăng tải Video'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Create Quiz Question Form */}
          {activeTab === 'create-quiz' && (
            <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10">
              <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                Tạo Câu Hỏi Trắc Nghiệm (Quiz)
              </h2>

              {questionSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-4 text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  {questionSuccessMsg}
                </div>
              )}
              {questionErrMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 text-xs font-bold text-rose-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  {questionErrMsg}
                </div>
              )}

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chọn Môn Học / Danh mục <span className="text-rose-500">*</span>
                  </label>
                  <CategorySelect value={questionCategoryId} onChange={setQuestionCategoryId} required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nội dung câu hỏi <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder="VD: Lực nào giữ Trái Đất quay xung quanh Mặt Trời theo Định luật Newton?"
                    rows={3}
                    className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold resize-none"
                    required
                  />
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="block text-xs font-extrabold text-slate-800">
                    Các lựa chọn trả lời (Bấm ô tròn để chọn đáp án ĐÚNG):
                  </label>
                  {options.map((opt, idx) => (
                    <div
                      key={opt.label}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                        opt.isCorrect
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                          : 'bg-white/60 border-purple-100'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(idx)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 transition-all ${
                          opt.isCorrect
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-purple-100'
                        }`}
                        title={opt.isCorrect ? 'Đáp án ĐÚNG' : 'Bấm để chọn làm đáp án ĐÚNG'}
                      >
                        {opt.isCorrect ? <Check className="w-4 h-4" /> : opt.label}
                      </button>
                      <input
                        type="text"
                        value={opt.content}
                        onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                        placeholder={`Nội dung lựa chọn ${opt.label}...`}
                        className="flex-1 px-3 py-1.5 bg-transparent border-0 text-slate-800 text-sm focus:outline-none font-medium"
                        required
                      />
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${opt.isCorrect ? 'text-emerald-700 bg-emerald-100' : 'text-slate-400'}`}>
                        {opt.isCorrect ? 'ĐÚNG ✅' : 'Sai'}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={createQuestionMutation.isPending}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  {createQuestionMutation.isPending ? 'Đang tạo...' : 'Lưu Câu Hỏi Quiz'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Manage Videos */}
          {activeTab === 'manage-videos' && (
            <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10">
              <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-pink-500" />
                Danh Sách Video Đã Xuất Bản
              </h2>

              {rawVideos.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-bold">Chưa có video nào.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rawVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-3.5 rounded-2xl bg-purple-50/30 border border-purple-100 flex items-center justify-between gap-3 hover:bg-white transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-purple-100">
                          {vid.thumbnailUrl || vid.thumbnailKey ? (
                            <img src={vid.thumbnailUrl || vid.thumbnailKey!} alt={vid.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-purple-400 font-bold text-xs">
                              <Film className="w-5 h-5 opacity-40" />
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">{vid.title}</h4>
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-1">
                            {vid.category && (
                              <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                                {vid.category.name}
                              </span>
                            )}
                            <span>👀 {vid.views} lượt xem</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        disabled={deleteVideoMutation.isPending}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                        title="Xóa video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Manage Quizzes */}
          {activeTab === 'manage-quizzes' && (
            <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10">
              <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-purple-600" />
                Danh Sách Câu Hỏi Quiz
              </h2>

              {questionsData.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-bold">Chưa có câu hỏi nào.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questionsData.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-purple-50/30 border border-purple-100 flex items-start justify-between gap-3 hover:bg-white transition-all shadow-sm"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          {q.category && (
                            <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                              {q.category.name}
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-400">ID: #{q.id}</span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-900">{q.content}</p>
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {q.options?.map((opt) => (
                            <div
                              key={opt.id || opt.label}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                                opt.isCorrect
                                  ? 'bg-emerald-100/70 border-emerald-300 font-extrabold text-emerald-800'
                                  : 'bg-white/80 border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="font-bold mr-1">{opt.label}:</span>
                              {opt.content}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        disabled={deleteQuestionMutation.isPending}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Manage Categories */}
          {activeTab === 'manage-categories' && (
            <div className="space-y-5">
              {/* Create category form */}
              <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10">
                <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-purple-600" />
                  Tạo Danh Mục Mới
                </h2>
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tên danh mục <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setNewCategorySlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                      }}
                      placeholder="VD: Vật Lý, Toán Học, Hóa Học..."
                      className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Slug (tự động tạo, có thể chỉnh)
                    </label>
                    <input
                      type="text"
                      value={newCategorySlug}
                      onChange={(e) => setNewCategorySlug(e.target.value)}
                      placeholder="vat-ly"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 text-sm focus:outline-none focus:border-purple-300 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {createCategoryMutation.isPending ? 'Đang tạo...' : 'Tạo Danh Mục'}
                  </button>
                </form>
              </div>

              {/* Category list */}
              <div className="p-6 rounded-3xl bg-white/90 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-500/10">
                <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-pink-500" />
                  Danh Sách Danh Mục ({categories.length})
                </h2>

                {categories.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-bold">Chưa có danh mục nào.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/30 border border-purple-100 hover:bg-white transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-purple-200 flex items-center justify-center">
                            <Tag className="w-3.5 h-3.5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-slate-900">{cat.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">/{cat.slug}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          disabled={deleteCategoryMutation.isPending}
                          className="p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-8" />
        </div>
      </div>
    </main>
  );
}
