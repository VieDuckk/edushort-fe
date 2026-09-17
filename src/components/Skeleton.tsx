import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-purple-100/60 via-pink-100/80 to-purple-100/60 ${className}`}
      {...props}
    />
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-900 flex flex-col justify-end p-5 relative overflow-hidden animate-pulse">
      {/* Background glowing shimmer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-950/40 to-slate-900" />
      
      {/* Sidebar Controls Skeleton */}
      <div className="absolute right-4 bottom-10 z-20 flex flex-col items-center gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20" />
            <div className="w-8 h-3 rounded bg-white/20" />
          </div>
        ))}
      </div>

      {/* Content Overlay Skeleton */}
      <div className="relative z-20 space-y-3 max-w-[calc(100%-75px)]">
        <div className="w-24 h-6 rounded-full bg-gradient-to-r from-pink-500/40 to-purple-500/40 border border-white/20" />
        <div className="w-4/5 h-6 rounded-lg bg-white/30" />
        <div className="w-full h-4 rounded-lg bg-white/20" />
        <div className="w-2/3 h-4 rounded-lg bg-white/20" />
      </div>
    </div>
  );
};

export const ReviewCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-3xl bg-white/80 border border-purple-100 animate-pulse space-y-3 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="w-20 h-5 rounded-full bg-purple-100" />
        <div className="w-16 h-4 rounded bg-slate-100" />
      </div>
      <div className="w-3/4 h-5 rounded-lg bg-purple-100/80" />
      <div className="p-3.5 rounded-2xl bg-purple-50/50 space-y-2">
        <div className="w-1/2 h-4 rounded bg-rose-100" />
        <div className="w-2/3 h-4 rounded bg-emerald-100" />
      </div>
    </div>
  );
};
