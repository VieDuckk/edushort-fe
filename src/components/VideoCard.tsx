'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Heart, Volume2, VolumeX, Tag, Eye, Music2, Pause } from 'lucide-react';
import { videoApi } from '@/api/video/video.api';
import { TVideo } from '@/@types/video.types';

export interface VideoItem {
  id: number;
  title: string;
  description?: string | null;
  videoUrl?: string;
  videoKey?: string;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  views: number;
  category?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
}

interface VideoCardProps {
  video: TVideo | VideoItem;
  isActive: boolean;
  onView: (videoId: number) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isActive, onView }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(video.views / 2) + 12);
  const [hasReportedView, setHasReportedView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const playPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isActive) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
      if (!hasReportedView) {
        setHasReportedView(true);
        onView(video.id);
        videoApi.increaseVideoView(video.id).catch(() => {});
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, video.id, onView, hasReportedView]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, []);

  const flashPlayPause = () => {
    setShowPlayPause(true);
    if (playPauseTimerRef.current) clearTimeout(playPauseTimerRef.current);
    playPauseTimerRef.current = setTimeout(() => setShowPlayPause(false), 700);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      flashPlayPause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div
      className="h-dvh w-full snap-start snap-always relative overflow-hidden bg-black flex flex-col justify-end select-none"
      onClick={togglePlay}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={video.videoUrl || video.videoKey}
        poster={video.thumbnailUrl || video.thumbnailKey || undefined}
        className="absolute inset-0 w-full h-full object-cover z-0"
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-40% to-black/90 pointer-events-none z-10" />

      {/* Flash play/pause icon */}
      {showPlayPause && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center animate-pop-up">
            {isPlaying
              ? <Play className="w-9 h-9 fill-white text-white ml-1" />
              : <Pause className="w-9 h-9 fill-white text-white" />
            }
          </div>
        </div>
      )}

      {/* Right sidebar — TikTok style */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              liked ? 'bg-rose-500/20' : 'bg-black/30 backdrop-blur-sm border border-white/20'
            }`}
            onClick={toggleLike}
          >
            <Heart className={`w-6 h-6 transition-all ${liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`} />
          </button>
          <span className="text-xs font-extrabold text-white drop-shadow">{likeCount.toLocaleString()}</span>
        </div>

        {/* Views */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-extrabold text-white drop-shadow">
            {(video.views + (hasReportedView ? 1 : 0)).toLocaleString()}
          </span>
        </div>

        {/* Mute/Unmute */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all active:scale-90"
            onClick={toggleMute}
          >
            {isMuted
              ? <VolumeX className="w-5 h-5 text-white" />
              : <Volume2 className="w-5 h-5 text-white" />
            }
          </button>
          <span className="text-xs font-extrabold text-white drop-shadow">
            {isMuted ? 'Tắt' : 'Bật'}
          </span>
        </div>

        {/* Spinning music disc */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className={`w-10 h-10 rounded-full border-2 border-white/30 bg-gradient-to-tr from-slate-800 via-purple-900 to-slate-900 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <div className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Panel */}
      <div className="relative z-20 px-4 pb-3 max-w-[calc(100%-72px)]">
        {/* Category tag */}
        {video.category && (
          <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-extrabold text-white mb-2 shadow-sm">
            <Tag className="w-3 h-3 text-pink-300" />
            {video.category.name}
          </div>
        )}

        {/* Creator handle */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm">
            ES
          </div>
          <span className="text-sm font-extrabold text-white drop-shadow">@EduShort</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-white leading-snug drop-shadow-lg mb-1">
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="text-sm text-white/85 leading-relaxed line-clamp-2 font-semibold drop-shadow">
            {video.description}
          </p>
        )}

        {/* Sound marquee */}
        <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
          <Music2 className="w-3.5 h-3.5 text-white/80 shrink-0" />
          <div className="text-xs text-white/80 font-bold truncate">
            Âm thanh gốc — EduShort
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
